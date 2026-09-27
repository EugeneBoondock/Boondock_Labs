import { getCloudflareContext } from "@opennextjs/cloudflare";

const WORK_ADMIN_EMAIL = "eugene@boondocklabs.co.za";
const GITHUB_ADMIN_EMAIL = "philosncube@gmail.com";
const GITHUB_IDP_ID = "fd344942-2d47-40ff-82fc-2b512944e8bb";

export type AdminEnvironment = {
  CF_ACCESS_TEAM_DOMAIN?: string;
  CF_ACCESS_AUD?: string;
  OUTREACH_DB?: unknown;
};

export type AdminAccess =
  | { ok: true; env: AdminEnvironment; email: string }
  | { ok: false; status: 401 | 403 | 503; reason: "denied" | "unavailable" };

export function getAdminEnvironment(): AdminEnvironment | null {
  try {
    return getCloudflareContext().env as AdminEnvironment;
  } catch {
    return null;
  }
}

function decodeBase64Url(value: string): Uint8Array {
  if (!/^[A-Za-z0-9_-]+$/.test(value))
    throw new Error("Invalid token encoding");
  const padded = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

function decodeJson(value: string): Record<string, unknown> {
  const decoded = new TextDecoder().decode(decodeBase64Url(value));
  const parsed: unknown = JSON.parse(decoded);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
    throw new Error("Invalid token JSON");
  return parsed as Record<string, unknown>;
}

function issuerFromDomain(value: string): string | null {
  const domain = value
    .trim()
    .toLowerCase()
    .replace(/^https:\/\//, "")
    .replace(/\/$/, "");
  if (!/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(domain)) return null;
  return `https://${domain}`;
}

async function signingKey(issuer: string, kid: string): Promise<CryptoKey> {
  const response = await fetch(`${issuer}/cdn-cgi/access/certs`, {
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error("Access keys unavailable");

  const document: unknown = await response.json();
  if (!document || typeof document !== "object")
    throw new Error("Invalid Access keys");
  const keys = document as { keys?: Array<Record<string, unknown>> };
  const jwk = keys.keys?.find(
    (candidate) =>
      candidate.kid === kid &&
      candidate.kty === "RSA" &&
      candidate.alg === "RS256",
  );
  if (!jwk) throw new Error("Access signing key missing");
  return crypto.subtle.importKey(
    "jwk",
    jwk as JsonWebKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
}

async function hasRequiredGitHubIdentity(
  issuer: string,
  assertion: string,
  jwtEmail: string,
): Promise<boolean> {
  const response = await fetch(`${issuer}/cdn-cgi/access/get-identity`, {
    method: "GET",
    headers: { Cookie: `CF_Authorization=${assertion}` },
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) return false;
  const identity: unknown = await response.json();
  if (!identity || typeof identity !== "object" || Array.isArray(identity))
    return false;
  const record = identity as Record<string, unknown>;
  if (
    !record.idp ||
    typeof record.idp !== "object" ||
    Array.isArray(record.idp)
  )
    return false;
  const idp = record.idp as Record<string, unknown>;
  return (
    record.email === jwtEmail &&
    idp.id === GITHUB_IDP_ID &&
    idp.type === "github"
  );
}

export async function verifyAdminAccess(
  assertion: string | null,
): Promise<AdminAccess> {
  const env = getAdminEnvironment();
  const issuer = env?.CF_ACCESS_TEAM_DOMAIN
    ? issuerFromDomain(env.CF_ACCESS_TEAM_DOMAIN)
    : null;
  const audience = env?.CF_ACCESS_AUD?.trim();
  if (!env || !issuer || !audience)
    return { ok: false, status: 503, reason: "unavailable" };
  if (!assertion || assertion.length > 16384)
    return { ok: false, status: 401, reason: "denied" };

  try {
    const parts = assertion.split(".");
    if (parts.length !== 3) throw new Error("Invalid token");
    const header = decodeJson(parts[0]);
    const claims = decodeJson(parts[1]);
    if (header.alg !== "RS256" || typeof header.kid !== "string" || !header.kid)
      throw new Error("Invalid signing method");
    const audienceMatches = Array.isArray(claims.aud)
      ? claims.aud.includes(audience)
      : claims.aud === audience;
    if (claims.iss !== issuer || !audienceMatches)
      throw new Error("Invalid token scope");
    const now = Math.floor(Date.now() / 1000);
    if (
      typeof claims.exp !== "number" ||
      claims.exp <= now ||
      (typeof claims.iat === "number" && claims.iat > now + 60) ||
      (typeof claims.nbf === "number" && claims.nbf > now)
    )
      throw new Error("Expired token");
    const key = await signingKey(issuer, header.kid);
    const signed = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
    const valid = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      key,
      decodeBase64Url(parts[2]),
      signed,
    );
    if (!valid) throw new Error("Invalid signature");
    if (claims.email === WORK_ADMIN_EMAIL)
      return { ok: true, env, email: WORK_ADMIN_EMAIL };
    if (claims.email !== GITHUB_ADMIN_EMAIL)
      return { ok: false, status: 403, reason: "denied" };
    const confirmed = await hasRequiredGitHubIdentity(
      issuer,
      assertion,
      GITHUB_ADMIN_EMAIL,
    );
    if (!confirmed) return { ok: false, status: 403, reason: "denied" };
    return { ok: true, env, email: GITHUB_ADMIN_EMAIL };
  } catch {
    return { ok: false, status: 401, reason: "denied" };
  }
}
