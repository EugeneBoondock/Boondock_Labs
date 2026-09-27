import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import { webcrypto } from "node:crypto";
import ts from "typescript";

function loadTypeScript(file, dependency = {}) {
  const source = readFileSync(new URL(file, import.meta.url), "utf8");
  const javascript = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const loadedModule = { exports: {} };
  new Function("module", "exports", "require", "fetch", "crypto", javascript)(
    loadedModule, loadedModule.exports,
    (name) => dependency[name] ?? { getCloudflareContext: () => ({ env: dependency.env }) },
    dependency.fetch,
    webcrypto,
  );
  return loadedModule.exports;
}

test("dashboard queries match the outreach registry and return stored records", async () => {
  const database = new DatabaseSync(":memory:");
  database.exec(readFileSync(new URL("../../../migrations/001_outreach_registry.sql", import.meta.url), "utf8"));
  const adapter = {
    prepare(sql) {
      return { async all() { return { results: database.prepare(sql).all() }; } };
    },
  };
  const { loadDashboard } = loadTypeScript("./dashboard.ts");
  const empty = await loadDashboard(adapter);
  assert.equal(empty.counts.prospects, 0);
  assert.deepEqual(empty.messages, []);

  database.exec(`
    INSERT INTO prospects (id, company_name, source, stage, owner_agent_id, created_at, updated_at)
    VALUES ('p1', 'Example Studio', 'research', 'quoted', 'outreach', '2026-09-27T10:00:00Z', '2026-09-27T10:00:00Z');
    INSERT INTO agent_runs (id, agent_id, trigger, status, started_at, created_at)
    VALUES ('r1', 'outreach', 'manual', 'running', '2026-09-27T10:00:00Z', '2026-09-27T10:00:00Z');
    INSERT INTO outreach_messages (id, prospect_id, direction, provider, from_email, to_email, subject, body_text, status, occurred_at, created_at)
    VALUES ('m1', 'p1', 'outbound', 'test', 'hello@example.com', 'contact@example.com', 'Hello', 'First contact', 'sent', '2026-09-27T10:00:00Z', '2026-09-27T10:00:00Z'),
           ('m2', 'p1', 'inbound', 'test', 'contact@example.com', 'hello@example.com', 'Re: Hello', 'Thanks', 'received', '2026-09-27T11:00:00Z', '2026-09-27T11:00:00Z');
    INSERT INTO quotes (id, prospect_id, quote_number, currency, amount_minor, status, sent_at, created_at, updated_at)
    VALUES ('q1', 'p1', 'Q-1', 'ZAR', 125000, 'accepted', '2026-09-27T12:00:00Z', '2026-09-27T12:00:00Z', '2026-09-27T12:00:00Z');
    INSERT INTO activity_events (id, prospect_id, actor_type, event_type, entity_type, entity_id, occurred_at, idempotency_key)
    VALUES ('e1', 'p1', 'agent', 'quote_accepted', 'quote', 'q1', '2026-09-27T12:00:00Z', 'test-e1');
  `);
  const data = await loadDashboard(adapter);
  assert.deepEqual({ ...data.counts }, { prospects: 1, outbound: 1, replies: 1, quotes_sent: 1, quotes_accepted: 1, active_runs: 1 });
  assert.equal(data.prospects[0].owner_agent_name, "Outreach");
  assert.equal(data.messages[0].direction, "inbound");
  assert.equal(data.runs[0].model, "gpt-6-luna");
  assert.equal(data.quotes[0].quote_number, "Q-1");
  assert.equal(data.activity[0].event_type, "quote_accepted");
  database.close();
});

test("admin access accepts the work email and verified GitHub identity only", async () => {
  const env = { CF_ACCESS_TEAM_DOMAIN: "https://cool-dew-053c.cloudflareaccess.com", CF_ACCESS_AUD: "admin-audience" };
  const keyPair = await webcrypto.subtle.generateKey(
    { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
    true,
    ["sign", "verify"],
  );
  const jwk = await webcrypto.subtle.exportKey("jwk", keyPair.publicKey);
  let identity = { email: "philosncube@gmail.com", idp: { id: "fd344942-2d47-40ff-82fc-2b512944e8bb", type: "github" } };
  let identityRequests = 0;
  let expectedIdentityToken = "";
  const fetcher = async (url, options) => {
    if (url.endsWith("/certs")) return { ok: true, json: async () => ({ keys: [{ ...jwk, kid: "test-key", alg: "RS256" }] }) };
    assert.equal(url, "https://cool-dew-053c.cloudflareaccess.com/cdn-cgi/access/get-identity");
    assert.equal(options.method, "GET");
    assert.equal(options.cache, "no-store");
    identityRequests++;
    assert.equal(options.headers.Cookie, `CF_Authorization=${expectedIdentityToken}`);
    return identity;
  };
  const { verifyAdminAccess } = loadTypeScript("./access.ts", { env, fetch: fetcher });
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  async function token(overrides = {}) {
    const head = encode({ alg: "RS256", kid: "test-key" });
    const body = encode({ iss: "https://cool-dew-053c.cloudflareaccess.com", aud: ["admin-audience"], email: "eugene@boondocklabs.co.za", exp: now + 600, ...overrides });
    const message = `${head}.${body}`;
    const signature = await webcrypto.subtle.sign("RSASSA-PKCS1-v1_5", keyPair.privateKey, new TextEncoder().encode(message));
    return `${message}.${Buffer.from(signature).toString("base64url")}`;
  }
  assert.equal((await verifyAdminAccess(await token())).email, "eugene@boondocklabs.co.za");
  assert.equal(identityRequests, 0);
  const githubToken = await token({ email: "philosncube@gmail.com" });
  expectedIdentityToken = githubToken;
  identity = { ok: true, json: async () => ({ email: "philosncube@gmail.com", idp: { id: "fd344942-2d47-40ff-82fc-2b512944e8bb", type: "github" } }) };
  assert.equal((await verifyAdminAccess(githubToken)).email, "philosncube@gmail.com");
  assert.equal(identityRequests, 1);
  env.CF_ACCESS_TEAM_DOMAIN = "cool-dew-053c.cloudflareaccess.com";
  assert.equal((await verifyAdminAccess(await token())).email, "eugene@boondocklabs.co.za");
  assert.equal((await verifyAdminAccess(githubToken)).email, "philosncube@gmail.com");
  env.CF_ACCESS_TEAM_DOMAIN = "https://cool-dew-053c.cloudflareaccess.com";
  identity = { ok: true, json: async () => ({ email: "philosncube@gmail.com", idp: { id: "fd344942-2d47-40ff-82fc-2b512944e8bb", type: "google" } }) };
  assert.equal((await verifyAdminAccess(githubToken)).status, 403);
  identity = { ok: true, json: async () => ({ email: "philosncube@gmail.com", idp: { id: "wrong-provider", type: "github" } }) };
  assert.equal((await verifyAdminAccess(githubToken)).status, 403);
  identity = { ok: true, json: async () => ({ email: "other@example.com", idp: { id: "fd344942-2d47-40ff-82fc-2b512944e8bb", type: "github" } }) };
  assert.equal((await verifyAdminAccess(githubToken)).status, 403);
  identity = { ok: false };
  assert.notEqual((await verifyAdminAccess(githubToken)).ok, true);
  identity = { ok: true, json: async () => { throw new Error("Identity service unavailable"); } };
  assert.notEqual((await verifyAdminAccess(githubToken)).ok, true);
  identity = { ok: true, json: async () => ({ email: "philosncube@gmail.com" }) };
  assert.equal((await verifyAdminAccess(githubToken)).status, 403);
  const priorIdentityRequests = identityRequests;
  assert.equal((await verifyAdminAccess(await token({ email: "someone@example.com" }))).status, 403);
  assert.equal((await verifyAdminAccess(await token({ aud: ["other-app"] }))).status, 401);
  assert.equal((await verifyAdminAccess(await token({ exp: now - 1 }))).status, 401);
  const valid = await token();
  assert.equal((await verifyAdminAccess(`${valid.slice(0, -2)}AA`)).status, 401);
  assert.equal((await verifyAdminAccess(null)).status, 401);
  assert.equal(identityRequests, priorIdentityRequests);
  for (const invalidDomain of [
    "http://cool-dew-053c.cloudflareaccess.com",
    "cool-dew-053c.cloudflareaccess.com.attacker.invalid",
    "cool-dew-053c.cloudflareaccess.com/path",
  ]) {
    env.CF_ACCESS_TEAM_DOMAIN = invalidDomain;
    assert.equal((await verifyAdminAccess(valid)).status, 503);
  }
  env.CF_ACCESS_TEAM_DOMAIN = "cool-dew-053c.cloudflareaccess.com";
  delete env.CF_ACCESS_AUD;
  assert.equal((await verifyAdminAccess(valid)).status, 503);
});
