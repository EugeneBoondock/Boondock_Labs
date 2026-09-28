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
const priorPriority = 'Prioritize small, independent South African businesses, especially those whose public listing explicitly says no dedicated website is listed and shows a public business email. A Facebook page alone is not a dedicated website. Larger businesses remain eligible when a specific, verified website opportunity is visible. Never infer that a business lacks a website solely because search did not find one; report the source and any uncertainty. If a listing or site cannot be independently checked by the controller, keep the lead for review rather than marking it qualified.';
const priority = 'On every scheduled research turn, use the web_search tool. Search broadly across South African provinces and sectors, including restaurants, caterers, trades, local shops, service providers, and professional studios. Prioritize small independent businesses with a public email and a listing that explicitly shows no dedicated website; a Facebook page alone is not a dedicated website. Include larger businesses when a specific website opportunity is visible. The controller checks the registry for duplicates, suppression, contact evidence, and page observations before qualifying a lead. Do not return an empty candidate list solely because one directory is inaccessible or you cannot query the registry. Return other candidate pages with exact public URLs and observations for controller verification. Do not infer that a business lacks a website merely because search did not find one. Never send mail or start a session on your own.';
let instructions = current.instructions;
instructions = instructions.replace(/Before returning a lead, check the outreach registry[\s\S]*?If registry access or source evidence is missing, return a review item instead of clearing the lead\./,
  'The controller verifies each public source and checks registry suppression and duplicate records before qualification. Return proposed leads with exact URLs and visible evidence. Never send an email, reply, WhatsApp message, or quote. Never start a session on your own.');
if (instructions.includes(priorPriority)) instructions = instructions.replace(priorPriority, priority);
else if (!instructions.includes(priority)) instructions += `\n${priority}`;
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
