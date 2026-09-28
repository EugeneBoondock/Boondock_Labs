import { readFileSync, writeFileSync, renameSync, chmodSync, mkdirSync } from 'node:fs';

const root = '/etc/boondock-outreach';
const secret = readFileSync(`${root}/environment-key`, 'utf8').trim();
const key = secret.includes('=') ? secret.split(/\r?\n/).find((line) => /^(?:CODEX_API_KEY|OPENAI_API_KEY)=/.test(line))?.split('=').slice(1).join('=') : secret;
if (!key?.startsWith('sk-') || /[\r\n\0]/.test(key)) throw new Error('Restricted environment key is missing or malformed');
const sessions = JSON.parse(readFileSync(`${root}/agent-sessions.json`, 'utf8'));
const directory = `${root}/executors`;
mkdirSync(directory, { recursive: true, mode: 0o700 });
for (const role of ['lead-research', 'outreach', 'reply-quotation']) {
  const session = sessions[role];
  if (!session?.environmentId || !session?.remoteUrl || !session?.workspace || session.workspace !== `/workspace/${role}`) {
    throw new Error(`Missing self-hosted session data for ${role}`);
  }
  if (!session.remoteUrl.startsWith('https://')) throw new Error(`Invalid remote URL for ${role}`);
  const target = `${directory}/${role}.env`;
  const temporary = `${target}.${process.pid}.tmp`;
  const value = `CODEX_API_KEY=${key}\nCODEX_REMOTE_URL=${session.remoteUrl}\nCODEX_ENVIRONMENT_ID=${session.environmentId}\n`;
  writeFileSync(temporary, value, { mode: 0o600, flag: 'wx' });
  chmodSync(temporary, 0o600);
  renameSync(temporary, target);
  console.log(`${role} restricted executor environment prepared`);
}
