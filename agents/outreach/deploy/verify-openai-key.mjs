import { readFileSync } from 'node:fs';

const path = process.argv[2] ?? '/etc/boondock-outreach/openai-key.env';
const entry = readFileSync(path, 'utf8')
  .split(/\r?\n/)
  .find((line) => line.startsWith('OPENAI_API_KEY='));
const key = entry?.slice('OPENAI_API_KEY='.length).trim();
if (!key?.startsWith('sk-proj-')) {
  console.error('No project API key in credential file');
  process.exit(1);
}

const response = await fetch('https://api.openai.com/v1/models', {
  headers: { Authorization: `Bearer ${key}` },
  signal: AbortSignal.timeout(15000),
});
if (!response.ok) {
  console.error(`OpenAI model-list request returned HTTP ${response.status}`);
  process.exit(1);
}
const body = await response.json();
if (!Array.isArray(body.data)) {
  console.error('OpenAI model-list response was missing data');
  process.exit(1);
}
const expectedModel = 'gpt-6-luna';
if (!body.data.some((model) => model.id === expectedModel)) {
  console.error(`OpenAI credential accepted, but ${expectedModel} is not listed`);
  process.exit(1);
}
console.log(`OpenAI credential accepted; ${expectedModel} is available`);
