import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';
import { writeFile, readFile, rename, chmod } from 'node:fs/promises';
import { GmailClient } from './gmail.mjs';

export const CALLBACK_PATH = '/oauth/google/callback';
export const GMAIL_SCOPES = Object.freeze([
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
]);

export function callbackUrl(publicBaseUrl) {
  const url = new URL(publicBaseUrl);
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash) throw new Error('OAuth public base URL must be an HTTPS origin');
  return new URL(CALLBACK_PATH, url).href;
}

function encryptionKey(value) {
  const key = Buffer.from(value ?? '', 'base64');
  if (key.length !== 32) throw new Error('OAuth encryption key must be 32 bytes in base64');
  return key;
}

export function encryptRefreshToken(refreshToken, keyBase64) {
  const iv = randomBytes(12), key = encryptionKey(keyBase64);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(refreshToken, 'utf8'), cipher.final()]);
  return JSON.stringify({ version: 1, iv: iv.toString('base64'), ciphertext: ciphertext.toString('base64'), tag: cipher.getAuthTag().toString('base64') });
}

export function decryptRefreshToken(envelope, keyBase64) {
  const parsed = JSON.parse(envelope), key = encryptionKey(keyBase64);
  if (parsed.version !== 1) throw new Error('Unsupported OAuth token envelope');
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(parsed.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(parsed.tag, 'base64'));
  return Buffer.concat([decipher.update(Buffer.from(parsed.ciphertext, 'base64')), decipher.final()]).toString('utf8');
}

export async function saveRefreshToken(path, refreshToken, keyBase64) {
  const temporary = `${path}.${randomBytes(8).toString('hex')}.tmp`;
  await writeFile(temporary, encryptRefreshToken(refreshToken, keyBase64), { mode: 0o600, flag: 'wx' });
  await chmod(temporary, 0o600);
  await rename(temporary, path);
  await chmod(path, 0o600);
}

export async function loadRefreshToken(path, keyBase64) {
  return decryptRefreshToken(await readFile(path, 'utf8'), keyBase64);
}

export function authorizationUrl({ clientId, publicBaseUrl, state, challenge }) {
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.search = new URLSearchParams({
    client_id: clientId, redirect_uri: callbackUrl(publicBaseUrl), response_type: 'code',
    scope: GMAIL_SCOPES.join(' '), access_type: 'offline', prompt: 'consent',
    include_granted_scopes: 'true', login_hint: 'eugene@boondocklabs.co.za', state, code_challenge: challenge, code_challenge_method: 'S256',
  }).toString();
  return url.href;
}

export async function exchangeCode({ code, verifier, clientId, clientSecret, publicBaseUrl, fetcher = fetch }) {
  const response = await fetcher('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ code, code_verifier: verifier, client_id: clientId, client_secret: clientSecret, redirect_uri: callbackUrl(publicBaseUrl), grant_type: 'authorization_code' }),
  });
  if (!response.ok) throw new Error(`Google OAuth exchange failed (${response.status})`);
  const result = await response.json();
  if (!result.refresh_token || !result.access_token) throw new Error('Google did not return offline access');
  const granted = new Set((result.scope ?? '').split(/\s+/));
  if (!GMAIL_SCOPES.every((scope) => granted.has(scope))) throw new Error('Required Gmail scopes were not granted');
  const gmail = new GmailClient({ clientId, clientSecret, refreshToken: result.refresh_token, fetcher });
  gmail.accessToken = result.access_token;
  gmail.expiresAt = Date.now() + (result.expires_in ?? 3600) * 1000;
  await gmail.profile();
  return result.refresh_token;
}
