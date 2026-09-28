import { readFileSync } from 'node:fs';

const env = Object.fromEntries(readFileSync('/etc/boondock-outreach/outreach.env', 'utf8').split(/\r?\n/).filter(Boolean).map((line) => {
  const at = line.indexOf('=');
  return [line.slice(0, at), line.slice(at + 1)];
}));
const base = env.OUTREACH_REGISTRY_URL;
const denied = await fetch(`${base}/agents`);
if (denied.status !== 403) throw new Error(`Unauthenticated registry returned HTTP ${denied.status}`);
const allowed = await fetch(`${base}/agents`, { headers: { Authorization: `Bearer ${env.OUTREACH_SERVICE_TOKEN}` } });
if (!allowed.ok) throw new Error(`Authenticated registry returned HTTP ${allowed.status}`);
const agents = await allowed.json();
if (!Array.isArray(agents) || agents.length !== 3) throw new Error('Expected three agent rows');
console.log(`Registry authentication passed; agents: ${agents.map((agent) => `${agent.id}=${agent.enabled ? 'enabled' : 'disabled'}`).join(', ')}`);
