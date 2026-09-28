import { readFileSync, writeFileSync, renameSync, chmodSync, mkdirSync } from 'node:fs';

const envPath = '/etc/boondock-outreach/outreach.env';
const statePath = '/etc/boondock-outreach/agent-sessions.json';
const env = Object.fromEntries(readFileSync(envPath, 'utf8').split(/\r?\n/).filter(Boolean).map((line) => {
  const split = line.indexOf('=');
  return [line.slice(0, split), line.slice(split + 1)];
}));
if (env.OUTREACH_SEND_ENABLED !== 'false') throw new Error('Outbound sending must remain disabled during session bootstrap');
const headers = {
  Authorization: `Bearer ${env.OPENAI_API_KEY}`,
  'OpenAI-Organization': env.OPENAI_ORG_ID,
  'OpenAI-Project': env.OPENAI_PROJECT_ID,
  'OpenAI-Beta': 'agents=v1',
  'Content-Type': 'application/json',
};
const roles = [
  ['lead-research', env.OPENAI_AGENT_LEAD_RESEARCH_ID],
  ['outreach', env.OPENAI_AGENT_OUTREACH_ID],
  ['reply-quotation', env.OPENAI_AGENT_REPLY_QUOTATION_ID],
];
let state = {};
try { state = JSON.parse(readFileSync(statePath, 'utf8')); }
catch (error) { if (error.code !== 'ENOENT') throw error; }

function save() {
  const temporary = `${statePath}.${process.pid}.tmp`;
  writeFileSync(temporary, JSON.stringify(state, null, 2) + '\n', { mode: 0o600, flag: 'wx' });
  chmodSync(temporary, 0o600);
  renameSync(temporary, statePath);
}

for (const [role, agentId] of roles) {
  if (!agentId) throw new Error(`Saved agent ID missing for ${role}`);
  const workspace = `/workspace/${role}`;
  mkdirSync(workspace, { recursive: true, mode: 0o700 });
  if (state[role]?.sessionId) {
    const response = await fetch(`https://api.openai.com/v1/agents/sessions/${encodeURIComponent(state[role].sessionId)}`, { headers });
    if (!response.ok) throw new Error(`Existing ${role} session lookup failed (HTTP ${response.status})`);
    const session = await response.json();
    if (session.agent?.id !== agentId && session.agent_id !== agentId) throw new Error(`Existing ${role} session has wrong agent`);
    console.log(`${role}: ${session.id} (${session.environment?.status ?? session.status ?? 'created'})`);
    continue;
  }
  const response = await fetch('https://api.openai.com/v1/agents/sessions', {
    method: 'POST', headers,
    body: JSON.stringify({ agent_id: agentId, environment: { type: 'self_hosted', workspace_directory: workspace },
      metadata: { boondock_role: role, deployment: 'network-solutions-vps' } }),
  });
  if (!response.ok) {
    let message = '';
    try { message = (await response.json()).error?.message ?? ''; } catch { /* Status remains available. */ }
    throw new Error(`${role} session creation failed (HTTP ${response.status})${message ? `: ${message.slice(0, 300)}` : ''}`);
  }
  const session = await response.json();
  if (!session.id || session.environment?.type !== 'self_hosted' || !session.environment.id || !session.environment.remote_url) {
    throw new Error(`${role} session response lacks self-hosted environment details`);
  }
  state[role] = { sessionId: session.id, agentId, model: session.agent?.model ?? 'gpt-6-luna',
    environmentId: session.environment.id, remoteUrl: session.environment.remote_url, workspace };
  save();
  console.log(`${role}: ${session.id} (environment ${session.environment.id})`);
}
