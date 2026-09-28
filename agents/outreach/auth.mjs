const ADMIN_EMAIL = 'eugene@boondocklabs.co.za';

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function sameSecret(received, expected) {
  if (!received || !expected) return false;
  const encoder = new TextEncoder();
  const [a, b] = await Promise.all([crypto.subtle.digest('SHA-256', encoder.encode(received)), crypto.subtle.digest('SHA-256', encoder.encode(expected))]);
  const left = new Uint8Array(a);
  const right = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < left.length; i++) diff |= left[i] ^ right[i];
  return diff === 0;
}

export async function isServiceRequest(request, env) {
  const header = request.headers.get('authorization') ?? '';
  if (!header.startsWith('Bearer ')) return false;
  return sameSecret(header.slice(7), env.OUTREACH_SERVICE_TOKEN);
}

export async function isAdminRequest(request, env, fetcher = fetch) {
  const token = request.headers.get('cf-access-jwt-assertion');
  if (!token || !env.CF_ACCESS_TEAM_DOMAIN || !env.CF_ACCESS_AUD) return false;
  try {
    const [encodedHeader, encodedPayload, encodedSignature, extra] = token.split('.');
    if (!encodedHeader || !encodedPayload || !encodedSignature || extra) return false;
    const header = JSON.parse(new TextDecoder().decode(decodeBase64Url(encodedHeader)));
    const payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(encodedPayload)));
    if (header.alg !== 'RS256' || typeof header.kid !== 'string') return false;
    const team = new URL(env.CF_ACCESS_TEAM_DOMAIN);
    if (team.protocol !== 'https:' || team.pathname !== '/' || team.search || team.hash) return false;
    if (payload.iss !== team.origin || !(Array.isArray(payload.aud) ? payload.aud.includes(env.CF_ACCESS_AUD) : payload.aud === env.CF_ACCESS_AUD)) return false;
    const now = Math.floor(Date.now() / 1000);
    if (!Number.isInteger(payload.exp) || payload.exp <= now || !Number.isInteger(payload.iat) || payload.iat > now + 60) return false;
    if (payload.email !== ADMIN_EMAIL) return false;
    const response = await fetcher(`${team.origin}/cdn-cgi/access/certs`);
    if (!response.ok) return false;
    const keys = (await response.json()).keys;
    const jwk = keys?.find((key) => key.kid === header.kid && key.kty === 'RSA');
    if (!jwk) return false;
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    return crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, decodeBase64Url(encodedSignature), new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`));
  } catch {
    return false;
  }
}
