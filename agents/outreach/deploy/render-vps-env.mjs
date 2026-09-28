import { randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync, renameSync, chmodSync } from 'node:fs';

const root = '/etc/boondock-outreach';
const target = `${root}/outreach.env`;
const oauth = JSON.parse(readFileSync(`${root}/google-oauth-client.json`, 'utf8')).web;
const openaiEntry = readFileSync(`${root}/openai-key.env`, 'utf8').split(/\r?\n/)
  .find((line) => line.startsWith('OPENAI_API_KEY='));
const openaiKey = openaiEntry?.slice('OPENAI_API_KEY='.length);
const serviceToken = readFileSync(`${root}/service-token`, 'utf8').trim();
if (!oauth?.client_id || !oauth?.client_secret || !openaiKey?.startsWith('sk-proj-') || serviceToken.length < 32) {
  throw new Error('Required private credentials are missing');
}
let encryptionKey = randomBytes(32).toString('base64');
try {
  const prior = readFileSync(target, 'utf8').split(/\r?\n/)
    .find((line) => line.startsWith('OUTREACH_TOKEN_ENCRYPTION_KEY='));
  if (prior) encryptionKey = prior.slice('OUTREACH_TOKEN_ENCRYPTION_KEY='.length);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const values = {
  OUTREACH_PUBLIC_BASE_URL: 'https://outreach.boondocklabs.co.za',
  OUTREACH_OAUTH_PORT: '8789',
  OUTREACH_OAUTH_TOKEN_FILE: '/var/lib/boondock-outreach/google-refresh.json',
  OUTREACH_TOKEN_ENCRYPTION_KEY: encryptionKey,
  OUTREACH_REGISTRY_URL: 'https://boondock-outreach-registry.boondock-labs-ltd.workers.dev',
  OUTREACH_SERVICE_TOKEN: serviceToken,
  OUTREACH_SEND_ENABLED: 'false',
  GMAIL_CLIENT_ID: oauth.client_id,
  GMAIL_CLIENT_SECRET: oauth.client_secret,
  CF_ACCESS_TEAM_DOMAIN: 'https://cool-dew-053c.cloudflareaccess.com',
  CF_ACCESS_AUD: 'f1cd5f90ef060b790d64a592d0fcb779ed1aa50f5af32bfcbec80c0b16d79d66',
  OPENAI_API_KEY: openaiKey,
  OPENAI_ORG_ID: 'org-1SdwOJNnKKuwY6HTLw2MctOA',
  OPENAI_PROJECT_ID: 'proj_N1LY6jzlSAuKSvZilFwhE3vP',
  OPENAI_AGENT_LEAD_RESEARCH_ID: 'agent_a6354eac39964c4aab517d8993549c437a6c659747a14330a0',
  OPENAI_AGENT_OUTREACH_ID: 'agent_56bf0db78f8346789c1588aa2667e26fa9055063392c4982a9',
  OPENAI_AGENT_REPLY_QUOTATION_ID: 'agent_7f75c12c19844b4c8cbb2c7266bde1ca5e3ab893f143491aaa',
};
for (const [name, value] of Object.entries(values)) {
  if (!value || /[\r\n\0]/.test(value)) throw new Error(`Invalid ${name}`);
}
const temporary = `${target}.${process.pid}.tmp`;
writeFileSync(temporary, Object.entries(values).map(([name, value]) => `${name}=${value}`).join('\n') + '\n', { mode: 0o600, flag: 'wx' });
chmodSync(temporary, 0o600);
renameSync(temporary, target);
console.log('Root-only outreach environment written; sending remains disabled');
