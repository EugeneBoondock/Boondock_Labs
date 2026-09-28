import { readFileSync } from 'node:fs';
import { GmailClient } from '../gmail.mjs';
import { loadRefreshToken } from '../oauth.mjs';
import { pollReplies } from '../poll.mjs';
import { RegistryClient } from '../registry-client.mjs';

const env = Object.fromEntries(readFileSync('/etc/boondock-outreach/outreach.env', 'utf8')
  .split(/\r?\n/).filter(Boolean).map((line) => [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1)]));
if (env.OUTREACH_SEND_ENABLED !== 'false') throw new Error('Mailbox bootstrap requires prospect send flag off');
const gmail = new GmailClient({ clientId: env.GMAIL_CLIENT_ID, clientSecret: env.GMAIL_CLIENT_SECRET,
  refreshToken: await loadRefreshToken(env.OUTREACH_OAUTH_TOKEN_FILE, env.OUTREACH_TOKEN_ENCRYPTION_KEY), allowSend: false });
const registry = new RegistryClient({ baseUrl: env.OUTREACH_REGISTRY_URL, token: env.OUTREACH_SERVICE_TOKEN });
const result = await pollReplies(gmail, registry);
console.log(JSON.stringify({ processed: result.processed, recorded: result.recorded,
  humanTakeovers: result.humanTakeovers, deliveryFailures: result.deliveryFailures }));
