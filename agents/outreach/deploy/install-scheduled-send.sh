#!/usr/bin/env bash
set -euo pipefail
mode="${1:-prepare}"
if [[ "$mode" != prepare && "$mode" != activate ]]; then
  echo 'Usage: install-scheduled-send.sh [prepare|activate]' >&2
  exit 2
fi
if [[ "$mode" == prepare ]]; then
  for timer in boondock-outreach-send@1.timer boondock-outreach-send@2.timer boondock-outreach-send@3.timer boondock-outreach-reply.timer; do
    if systemctl is-active --quiet "$timer" || systemctl is-enabled --quiet "$timer"; then
      echo "Refusing prepare while $timer is active or enabled" >&2
      exit 1
    fi
  done
fi

cd /opt/boondock-outreach/current
test -f agents/outreach/scheduled-send.mjs
test -f agents/outreach/schedule.mjs
test -f agents/outreach/scheduled-reply.mjs
test -f /etc/boondock-outreach/agent-sessions.json
grep -qx 'OUTREACH_SEND_ENABLED=false' /etc/boondock-outreach/outreach.env
node --check agents/outreach/scheduled-send.mjs
node --check agents/outreach/scheduled-reply.mjs

install -m 0644 agents/outreach/deploy/boondock-outreach-send@.service /etc/systemd/system/boondock-outreach-send@.service
install -m 0644 agents/outreach/deploy/boondock-outreach-reply.service /etc/systemd/system/boondock-outreach-reply.service
install -m 0644 agents/outreach/deploy/boondock-outreach-reply.timer /etc/systemd/system/boondock-outreach-reply.timer
for slot in 1 2 3; do
  install -m 0644 "agents/outreach/deploy/boondock-outreach-send@${slot}.timer" "/etc/systemd/system/boondock-outreach-send@${slot}.timer"
done
chgrp boondock-outreach /etc/boondock-outreach
chmod 0710 /etc/boondock-outreach
chgrp boondock-outreach /etc/boondock-outreach/agent-sessions.json
chmod 0640 /etc/boondock-outreach/agent-sessions.json
systemd-analyze verify /etc/systemd/system/boondock-outreach-send@.service \
  /etc/systemd/system/boondock-outreach-send@{1,2,3}.timer \
  /etc/systemd/system/boondock-outreach-reply.service /etc/systemd/system/boondock-outreach-reply.timer
systemctl daemon-reload

# A check run validates the service account, Gmail identity, saved session, and live registry without sending.
systemd-run --collect --wait --pipe \
  -p User=boondock-outreach -p Group=boondock-outreach \
  -p WorkingDirectory=/opt/boondock-outreach/current \
  -p EnvironmentFile=/etc/boondock-outreach/outreach.env \
  /usr/bin/node /opt/boondock-outreach/current/agents/outreach/scheduled-send.mjs 1 --check
systemd-run --collect --wait --pipe \
  -p User=boondock-outreach -p Group=boondock-outreach \
  -p WorkingDirectory=/opt/boondock-outreach/current \
  -p EnvironmentFile=/etc/boondock-outreach/outreach.env \
  /usr/bin/node /opt/boondock-outreach/current/agents/outreach/scheduled-reply.mjs --check

if [[ "$mode" == activate ]]; then
  systemctl enable --now boondock-outreach-send@1.timer boondock-outreach-send@2.timer boondock-outreach-send@3.timer boondock-outreach-reply.timer
  systemctl list-timers 'boondock-outreach-send@*.timer' boondock-outreach-reply.timer --no-pager
else
  echo 'Read-only preflight passed. Send timers remain disabled.'
fi
