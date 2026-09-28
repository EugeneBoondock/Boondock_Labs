import { readFileSync } from 'node:fs';

const env = Object.fromEntries(readFileSync('/etc/boondock-outreach/outreach.env', 'utf8')
  .split(/\r?\n/).filter(Boolean).map((line) => [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1)]));
if (env.OUTREACH_SEND_ENABLED !== 'false') throw new Error('Prospect sends must be disabled during policy update');
const id = env.OPENAI_AGENT_OUTREACH_ID;
const url = `https://api.openai.com/v1/agents/${encodeURIComponent(id)}`;
const headers = { Authorization: `Bearer ${env.OPENAI_API_KEY}`, 'OpenAI-Organization': env.OPENAI_ORG_ID,
  'OpenAI-Project': env.OPENAI_PROJECT_ID, 'OpenAI-Beta': 'agents=v1', 'Content-Type': 'application/json' };
const currentResponse = await fetch(url, { headers });
if (!currentResponse.ok) throw new Error(`Saved outreach agent lookup failed (${currentResponse.status})`);
const current = await currentResponse.json();
const old = 'a maximum of five cold emails per rolling day, and the spacing limit set by the controller.';
const prior = 'a maximum of 15 qualified initial attempts in one approved run, at most three runs per Africa/Johannesburg local day, and a maximum of 45 initial attempts in that local day. The controller and registry enforce these caps and any spacing. Count attempted sends, including accepted sends later bounced, toward limits.';
const previous = 'a maximum of 15 qualified initial attempts in one approved run, at most four runs per Africa/Johannesburg local day, and a maximum of 60 initial attempts in that local day. The controller and registry enforce these caps and any spacing. Count attempted sends, including accepted sends later bounced, toward limits.';
const replacement = 'a maximum of 50 qualified initial attempts in one approved run, at most four runs per Africa/Johannesburg local day, and a maximum of 200 initial attempts in that local day. The controller and registry enforce these caps and any spacing. Count attempted sends, including accepted sends later bounced, toward limits.';
let instructions = current.instructions;
if (instructions.includes(old)) instructions = instructions.replace(old, replacement);
else if (instructions.includes(prior)) instructions = instructions.replace(prior, replacement);
else if (instructions.includes(previous)) instructions = instructions.replace(previous, replacement);
else if (!instructions.includes(replacement)) throw new Error('Saved outreach cap sentence differs from expected policy');
if (!instructions.includes('Boondock Labs is based in South Africa.')) {
  instructions = instructions.replace('Role: Prepare one tailored initial Boondock Labs email',
    'Boondock Labs is based in South Africa and serves South African businesses. Use South African English and ZAR for any approved pricing discussion.\nRole: Prepare one tailored initial Boondock Labs email');
}
const introductionPolicy = 'For every initial email, introduce yourself in the body as Eugene from Boondock Labs and explain in plain language that we design and build websites for South African businesses. Write a considerate 95 to 140 word note that acknowledges the recipient’s work, describes one verified observation without talking down to them, offers one specific helpful idea, invites a reply or short call, and gives an easy opt-out. Do not rely on the signature as the introduction. Do not send a generic one-paragraph pitch.';
if (!instructions.includes(introductionPolicy)) instructions += `\n${introductionPolicy}`;
if (instructions === current.instructions) {
  console.log(JSON.stringify({ id, updated: false, cap50: true, daily200: true, southAfrica: true, introductionPolicy: true }));
  process.exit(0);
}
const update = await fetch(url, { method: 'POST', headers, body: JSON.stringify({ instructions }) });
if (!update.ok) {
  const error = await update.json().catch(() => null);
  throw new Error(`Saved outreach agent update failed (${update.status}): ${String(error?.error?.message ?? '').slice(0, 200)}`);
}
const after = await (await fetch(url, { headers })).json();
if (after.id !== id || after.model !== 'gpt-6-luna' || after.instructions !== instructions) throw new Error('Saved outreach agent update did not persist');
console.log(JSON.stringify({ id, updated: true, cap50: true, daily200: true, southAfrica: true, introductionPolicy: true }));
