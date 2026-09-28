import { readFileSync } from 'node:fs';

const env = Object.fromEntries(readFileSync('/etc/boondock-outreach/outreach.env', 'utf8')
  .split(/\r?\n/).filter(Boolean).map((line) => [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1)]));
if (env.OUTREACH_SEND_ENABLED !== 'false') throw new Error('Legacy send path must remain disabled');
const id = env.OPENAI_AGENT_LEAD_RESEARCH_ID;
const url = `https://api.openai.com/v1/agents/${encodeURIComponent(id)}`;
const headers = { Authorization: `Bearer ${env.OPENAI_API_KEY}`, 'OpenAI-Organization': env.OPENAI_ORG_ID,
  'OpenAI-Project': env.OPENAI_PROJECT_ID, 'OpenAI-Beta': 'agents=v1', 'Content-Type': 'application/json' };
const response = await fetch(url, { headers });
if (!response.ok) throw new Error(`Lead agent lookup failed (${response.status})`);
const current = await response.json();
const priority = 'Prioritize small, independent South African businesses, especially those whose public listing explicitly says no dedicated website is listed and shows a public business email. A Facebook page alone is not a dedicated website. Larger businesses remain eligible when a specific, verified website opportunity is visible. Never infer that a business lacks a website solely because search did not find one; report the source and any uncertainty. If a listing or site cannot be independently checked by the controller, keep the lead for review rather than marking it qualified.';
const instructions = current.instructions.includes(priority) ? current.instructions : `${current.instructions}\n${priority}`;
if (instructions !== current.instructions) {
  const update = await fetch(url, { method: 'POST', headers, body: JSON.stringify({ instructions }) });
  if (!update.ok) throw new Error(`Lead agent update failed (${update.status})`);
}
const afterResponse = await fetch(url, { headers });
if (!afterResponse.ok) throw new Error(`Lead agent read-back failed (${afterResponse.status})`);
const after = await afterResponse.json();
if (after.id !== id || after.instructions !== instructions) throw new Error('Lead agent priority did not persist');
console.log(JSON.stringify({ id, updated: instructions !== current.instructions, smallBusinessPriority: true,
  noDedicatedWebsitePriority: true, largerBusinessEligible: true }));
