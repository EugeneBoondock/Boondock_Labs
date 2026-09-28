#!/usr/bin/env bash
set -euo pipefail
cert=/etc/pki/tls/certs/outreach-origin.pem
key=/etc/pki/tls/private/outreach-origin.key
openssl x509 -in "$cert" -noout -checkhost outreach.boondocklabs.co.za
openssl x509 -in "$cert" -noout -checkend 86400
cmp -s \
  <(openssl x509 -in "$cert" -pubkey -noout) \
  <(openssl pkey -in "$key" -pubout)
echo 'Origin certificate hostname, expiry, and private-key match verified'
