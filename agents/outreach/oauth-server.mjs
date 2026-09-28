import { createServer } from 'node:http';
import { randomBytes, createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { isAdminRequest } from './auth.mjs';
import { authorizationUrl, callbackUrl, CALLBACK_PATH, exchangeCode, saveRefreshToken } from './oauth.mjs';

const sessions = new Map();
const cookieName = 'boondock_oauth_state';

function respond(response, status, text, headers = {}) {
  response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', ...headers });
  response.end(text);
}

export function createOauthServer(env = process.env) {
  const origin = new URL(env.OUTREACH_PUBLIC_BASE_URL);
  callbackUrl(origin.href);
  return createServer(async (request, response) => {
    const url = new URL(request.url, origin);
    try {
      if (request.method === 'GET' && url.pathname === '/oauth/google/start') {
        const authorized = await isAdminRequest(new Request(url, { headers: request.headers }), {
          CF_ACCESS_TEAM_DOMAIN: env.CF_ACCESS_TEAM_DOMAIN, CF_ACCESS_AUD: env.CF_ACCESS_AUD,
        });
        if (!authorized) return respond(response, 403, 'Cloudflare Access admin identity required');
        const state = randomBytes(32).toString('base64url');
        const verifier = randomBytes(32).toString('base64url');
        const challenge = createHash('sha256').update(verifier).digest('base64url');
        sessions.set(state, { verifier, expiresAt: Date.now() + 10 * 60 * 1000 });
        response.writeHead(302, { Location: authorizationUrl({ clientId: env.GMAIL_CLIENT_ID, publicBaseUrl: origin.href, state, challenge }),
          'Set-Cookie': `${cookieName}=${state}; Path=/oauth/google; Max-Age=600; HttpOnly; Secure; SameSite=Lax`, 'Cache-Control': 'no-store' });
        return response.end();
      }
      if (request.method === 'GET' && url.pathname === CALLBACK_PATH) {
        const state = url.searchParams.get('state');
        const cookie = request.headers.cookie?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
        const session = state ? sessions.get(state) : null;
        if (!state || cookie !== state || !session || session.expiresAt < Date.now()) return respond(response, 400, 'OAuth state invalid or expired');
        sessions.delete(state);
        const code = url.searchParams.get('code');
        if (!code) return respond(response, 400, 'Google authorization was not completed');
        const refreshToken = await exchangeCode({ code, verifier: session.verifier, clientId: env.GMAIL_CLIENT_ID, clientSecret: env.GMAIL_CLIENT_SECRET, publicBaseUrl: origin.href });
        await saveRefreshToken(env.OUTREACH_OAUTH_TOKEN_FILE, refreshToken, env.OUTREACH_TOKEN_ENCRYPTION_KEY);
        return respond(response, 200, 'Eugene mailbox authorization saved. You can close this tab.', { 'Set-Cookie': `${cookieName}=; Path=/oauth/google; Max-Age=0; HttpOnly; Secure; SameSite=Lax` });
      }
      return respond(response, 404, 'Not found');
    } catch {
      return respond(response, 500, 'OAuth setup failed. Check private service logs.');
    }
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  createOauthServer().listen(Number(process.env.OUTREACH_OAUTH_PORT ?? 8789), '127.0.0.1');
}
