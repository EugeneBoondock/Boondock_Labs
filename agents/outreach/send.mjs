import { createHash } from 'node:crypto';
import { renderQuotePdf } from './pdf.mjs';
import { assessQuoteContext, requiredText } from './rules.mjs';

export function deterministicMessageId(key) {
  const digest = createHash('sha256').update(key).digest('hex').slice(0, 32);
  return `<outreach-${digest}@boondocklabs.co.za>`;
}

export async function sendOutreach({ registry, gmail, prospect, subject, bodyText, idempotencyKey, agentRunId = null, pdf = null, kind, inboundMessageId = null }) {
  if (!gmail.allowSend) throw new Error('Outbound Gmail send is disabled');
  subject = requiredText(subject, 'subject', 998);
  bodyText = requiredText(bodyText, 'body', 100000);
  const inbound = kind === 'reply' ? await registry.request(`/messages/${encodeURIComponent(inboundMessageId)}`) : null;
  if (kind === 'reply' && (!inbound || inbound.prospect_id !== prospect.id || !inbound.rfcMessageId)) throw new Error('Stored inbound Message-ID required for reply');
  if (/(?:\+27[\s-]*81[\s-]*628[\s-]*8767|081[\s-]*628[\s-]*8767)/.test(bodyText) && (!inbound || !/\b(?:phone|call|whatsapp|contact number)\b/i.test(inbound.body_text))) {
    throw new Error('WhatsApp number was not requested by this contact');
  }
  const reservation = await registry.request('/outbound/reserve', { prospectId: prospect.id, agentRunId, idempotencyKey, kind, inboundMessageId });
  const key = reservation.idempotencyKey;
  await registry.request('/outbound/sending', { idempotencyKey: key });
  try {
    const sent = await gmail.send({ to: prospect.email_normalized, subject, text: bodyText, messageId: deterministicMessageId(key), pdf,
      inReplyToId: inbound?.rfcMessageId ?? null, threadId: inbound?.provider_thread_id ?? null });
    return await registry.request('/outbound/sent', { idempotencyKey: key, provider: 'gmail', providerMessageId: sent.id, providerThreadId: sent.threadId,
      inReplyToId: inbound?.rfcMessageId ?? null, subject, bodyText });
  } catch (error) {
    await registry.request('/outbound/uncertain', { idempotencyKey: key, reason: 'Provider outcome needs reconciliation' });
    throw error;
  }
}

export async function prepareQuotePdf({ registry, quote, companyName }) {
  if (quote.reviewStatus !== 'approved') throw new Error('Quote needs approval');
  const items = quote.items.map((item) => ({ quantity: item.quantity, description: item.description, lineTotalMinor: item.line_total_minor }));
  const bytes = renderQuotePdf({ quoteNumber: quote.quote_number, companyName, currency: quote.currency, amountMinor: quote.amount_minor, items, issuedAt: quote.issued_at, expiresAt: quote.expires_at, context: quote.context });
  const sha256Hex = createHash('sha256').update(bytes).digest('hex');
  await registry.request(`/quotes/${quote.id}/pdf`, { pdfBase64: bytes.toString('base64'), sha256Hex, idempotencyKey: `quote:${quote.id}:pdf:${sha256Hex}` });
  return { filename: `${quote.quote_number}.pdf`, bytes, sha256Hex };
}

export async function sendQuote({ registry, gmail, quote, prospect, subject, bodyText, inboundMessageId }) {
  if (!gmail.allowSend || quote.status !== 'draft' || quote.reviewStatus !== 'approved') throw new Error('Quote is not ready to send');
  if (new Date(quote.expires_at).getTime() <= Date.now() ||
      !assessQuoteContext(quote.context?.scope, quote.context?.benchmarks, quote.context?.assumptions).complete) {
    throw new Error('Quote expired or current scope and market evidence needs review');
  }
  if (!inboundMessageId) throw new Error('Inbound message required for quote response');
  const pdf = await prepareQuotePdf({ registry, quote, companyName: prospect.company_name });
  const message = await sendOutreach({ registry, gmail, prospect, subject, bodyText, inboundMessageId, kind: 'reply', pdf,
    agentRunId: quote.agent_run_id, idempotencyKey: `quote:${quote.id}:send` });
  await registry.request(`/quotes/${quote.id}/sent`, { messageId: message.id, idempotencyKey: `quote:${quote.id}:sent` });
  return message;
}
