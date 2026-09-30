import { readFileSync } from 'node:fs';

const root = '/etc/boondock-outreach';
const env = Object.fromEntries(readFileSync(`${root}/outreach.env`, 'utf8').split(/\r?\n/).filter(Boolean).map((line) => {
  const at = line.indexOf('=');
  return [line.slice(0, at), line.slice(at + 1)];
}));
const state = JSON.parse(readFileSync(`${root}/agent-sessions.json`, 'utf8'));
const headers = { Authorization: `Bearer ${env.OPENAI_API_KEY}`, 'OpenAI-Organization': env.OPENAI_ORG_ID,
  'OpenAI-Project': env.OPENAI_PROJECT_ID, 'OpenAI-Beta': 'agents=v1' };
for (const role of ['lead-research', 'outreach', 'reply-quotation']) {
  const saved = state[role];
  if (!saved?.sessionId) throw new Error(`Missing ${role} session`);
  const response = await fetch(`https://api.openai.com/v1/agents/sessions/${encodeURIComponent(saved.sessionId)}`, { headers });
  if (!response.ok) throw new Error(`${role} session lookup failed (HTTP ${response.status})`);
  const session = await response.json();
  if (session.id !== saved.sessionId || session.environment?.type !== 'self_hosted' || session.environment?.id !== saved.environmentId ||
    session.agent?.model !== 'gpt-5.6-luna') throw new Error(`${role} session identity mismatch`);
  const environmentResponse = await fetch(`https://api.openai.com/v1/agents/environments/${encodeURIComponent(saved.environmentId)}`, { headers });
  if (!environmentResponse.ok) throw new Error(`${role} environment lookup failed (HTTP ${environmentResponse.status})`);
  const environment = await environmentResponse.json();
  console.log(`${role}: session=${session.id} status=${session.status ?? 'unknown'} environment=${environment.status ?? 'unknown'} model=${session.agent.model}`);
}
