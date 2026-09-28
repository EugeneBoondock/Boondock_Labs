import { isAdminRequest, isServiceRequest } from './auth.mjs';
import { Registry, southAfricanDayBounds } from './store.mjs';

const json = (data, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
const fail = (message, status) => json({ error: message }, status);

async function body(request) {
  const length = Number(request.headers.get('content-length') ?? 0);
  if (length > 1500000) throw new Error('Request too large');
  const value = await request.json();
  if (!value || Array.isArray(value) || typeof value !== 'object') throw new Error('Invalid JSON body');
  return value;
}

function registry(env) {
  if (!env.OUTREACH_DB) throw new Error('D1 binding OUTREACH_DB is missing');
  return new Registry(env.OUTREACH_DB, {
    dailyLimit: Number(env.OUTREACH_DAILY_LIMIT ?? 200),
    runLimit: Number(env.OUTREACH_RUN_LIMIT ?? 50),
    maxQuoteMinor: Number(env.OUTREACH_MAX_QUOTE_MINOR ?? 100000000),
    catalog: env.OUTREACH_PRICING_JSON ? JSON.parse(env.OUTREACH_PRICING_JSON) : {},
  });
}

export async function handleOutreachRequest(request, env) {
  const path = new URL(request.url).pathname.replace(/^\/api\/outreach/, '').replace(/^\/+|\/+$/g, '');
  const parts = path ? path.split('/') : [];
  const method = request.method;
  const service = await isServiceRequest(request, env);
  const admin = await isAdminRequest(request, env);
  if (!service && !admin) return fail('Unauthorized', 403);
  const adminWrite = (parts[0] === 'agents' && parts[2] === 'enabled') || (parts[0] === 'quotes' && parts[2] === 'approve') ||
    (parts[0] === 'prospects' && parts[2] === 'release-human-control');
  if (method !== 'GET' && !service && !(admin && adminWrite)) return fail('Service authentication required', 403);
  const db = registry(env);
  try {
    if (method === 'GET' && path === 'policy') return json({ version: 'za-day-cap-verified-market-v1',
      dayBounds: southAfricanDayBounds(new Date()), dailyInitialLimit: db.dailyLimit, perRunInitialLimit: db.runLimit });
    if (method === 'GET' && path === 'agents') return json(await db.listAgents());
    if (method === 'GET' && path === 'prospects') return json(await db.listProspects());
    if (method === 'GET' && path === 'runs') return json(await db.listRuns());
    if (method === 'GET' && path === 'messages/pending-replies') return json(await db.pendingReplies());
    if (method === 'GET' && path === 'mailbox/cursor') return json(await db.mailboxCursor());
    if (method === 'GET' && path === 'mailbox/self-test') return json(await db.selfTest(new URL(request.url).searchParams.get('key')));
    if (method === 'GET' && path === 'prospects/by-email') return json(await db.prospectByEmail(new URL(request.url).searchParams.get('email')));
    if (method === 'GET' && parts[0] === 'prospects' && parts.length === 2) return json(await db.prospect(parts[1]));
    if (method === 'GET' && parts[0] === 'prospects' && parts[2] === 'suppression') {
      const prospect = await db.prospect(parts[1]);
      if (!prospect) return fail('Prospect not found', 404);
      return json(await db.suppression(prospect, ['human_owned','handoff','permanent_delivery_failure']));
    }
    if (method === 'GET' && parts[0] === 'prospects' && parts[2] === 'events') return json(await db.timeline(parts[1]));
    if (method === 'GET' && parts[0] === 'messages' && parts.length === 2) return json(await db.inboundForReply(parts[1]));
    if (method === 'GET' && parts[0] === 'quotes' && parts.length === 2) return json(await db.quote(parts[1]));
    if (method === 'GET' && parts[0] === 'quotes' && parts[2] === 'pdf') {
      const document = await db.pdf(parts[1]);
      if (!document) return fail('PDF not found', 404);
      const binary = atob(document.pdf_base64);
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      return new Response(bytes, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${document.filename.replace(/[^A-Za-z0-9._-]/g, '_')}"`, 'Cache-Control': 'no-store' } });
    }
    if (method !== 'POST') return fail('Not found', 404);
    const data = await body(request);
    if (path === 'prospects') return json(await db.addProspect(data), 201);
    if (parts[0] === 'prospects' && parts[2] === 'stage') return json(await db.changeStage(parts[1], data.stage, data.idempotencyKey, service ? 'agent' : 'admin'));
    if (parts[0] === 'prospects' && parts[2] === 'observations') return json(await db.recordObservations(parts[1], data.observations, data.idempotencyKey));
    if (path === 'runs') return json(await db.createRun(data), 201);
    if (parts[0] === 'runs' && parts[2] === 'status') return json(await db.updateRun(parts[1], data.status, data.idempotencyKey, data.externalRunId, data.errorSummary));
    if (parts[0] === 'runs' && parts[2] === 'session') return json(await db.linkRunSession(parts[1], data.externalRunId, data.idempotencyKey));
    if (path === 'messages/inbound') return json(await db.recordInbound(data), 201);
    if (path === 'mailbox/sent-evidence') return json(await db.recordSentEvidence(data), 201);
    if (path === 'mailbox/delivery-failure') return json(await db.recordDeliveryFailure(data), 201);
    if (path === 'mailbox/self-test') return json(await db.recordSelfTest(data), 201);
    if (path === 'handoffs') return json(await db.requestHandoff(data), 201);
    if (parts[0] === 'prospects' && parts[2] === 'release-human-control') {
      if (!admin) return fail('Admin Access required', 403);
      return json(await db.releaseHumanControl(parts[1], data.idempotencyKey));
    }
    if (path === 'opt-outs') return json(await db.optOut(data), 201);
    if (path === 'outbound/reserve') return json(await db.reserveOutbound(data), 201);
    if (path === 'outbound/sending') return json(await db.markSending(data.idempotencyKey));
    if (path === 'outbound/sent') return json(await db.finishOutbound(data), 201);
    if (path === 'outbound/uncertain') return json(await db.markUncertain(data.idempotencyKey, data.reason));
    if (path === 'quotes') return json(await db.createQuote(data), 201);
    if (parts[0] === 'quotes' && parts[2] === 'approve') {
      if (!admin) return fail('Admin Access required', 403);
      return json(await db.approveQuote(parts[1], data.prices, data.idempotencyKey, 'eugene@boondocklabs.co.za'));
    }
    if (parts[0] === 'quotes' && parts[2] === 'context') return json(await db.updateQuoteContext(parts[1], data));
    if (parts[0] === 'quotes' && parts[2] === 'pdf') return json(await db.storeQuotePdf(parts[1], data.pdfBase64, data.sha256Hex, data.idempotencyKey));
    if (parts[0] === 'quotes' && parts[2] === 'sent') return json(await db.markQuoteSent(parts[1], data.messageId, data.idempotencyKey));
    if (parts[0] === 'agents' && parts[2] === 'enabled') {
      if (!admin) return fail('Admin Access required', 403);
      return json(await db.setAgentEnabled(parts[1], data.enabled, data.idempotencyKey));
    }
    if (path === 'mailbox/cursor') return json(await db.updateMailboxCursor(data.historyId, data.idempotencyKey));
    return fail('Not found', 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Request failed';
    const conflict = /UNIQUE constraint|changed concurrently|already attempted|prior reservation|Daily limit|already active/i.test(message);
    const invalid = /Invalid|not ready|not found|missing|required|opt out|disabled|needs approval|pending review|blocked|not active|not sending|suppression|human takeover|handoff|delivery failure/i.test(message);
    return fail(conflict || invalid ? message : 'Registry operation failed', conflict ? 409 : invalid ? 400 : 500);
  }
}

export default { fetch: handleOutreachRequest };
