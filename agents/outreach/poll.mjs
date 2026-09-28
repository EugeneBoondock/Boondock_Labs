import { SENDER } from './rules.mjs';
import { parseGmailMessage, sentRecipients } from './gmail.mjs';

export function asksToStop(text) {
  return /\b(?:unsubscribe|stop emailing me|do not (?:email|contact) me|remove me from (?:your|this) list)\b/i.test(text);
}

async function ingest(id, gmail, registry) {
  const raw = await gmail.getMessage(id);
  if (raw.labelIds?.includes('SENT')) {
    const message = parseGmailMessage(raw);
    if (message.fromEmail !== SENDER) return 'skipped';
    let manual = false;
    for (const email of sentRecipients(raw)) {
      const result = await registry.request('/mailbox/sent-evidence', { recipientEmail: email, providerMessageId: raw.id,
        rfcMessageId: message.rfcMessageId, occurredAt: message.occurredAt });
      if (result.source === 'manual') manual = true;
    }
    return manual ? 'human-takeover' : 'sent-observed';
  }
  if (!raw.labelIds?.includes('INBOX')) return 'skipped';
  const message = parseGmailMessage(raw);
  const failure = parseDeliveryFailure(message);
  if (failure) {
    let recorded = false;
    for (const email of failure.recipients) {
      try {
        await registry.request('/mailbox/delivery-failure', { recipientEmail: email, providerMessageId: raw.id,
          smtpStatus: failure.smtpStatus, diagnostic: failure.diagnostic, occurredAt: message.occurredAt });
        recorded = true;
      } catch (error) {
        if (!/no matching Sent mail/i.test(error.message)) throw error;
      }
    }
    return recorded ? 'delivery-failure' : 'unmatched-delivery-failure';
  }
  if (!message.fromEmail || message.fromEmail === SENDER || message.toEmail !== SENDER) return 'skipped';
  const prospect = await registry.request(`/prospects/by-email?email=${encodeURIComponent(message.fromEmail)}`);
  if (!prospect) return 'unknown-contact';
  await registry.request('/messages/inbound', { ...message, prospectId: prospect.id, idempotencyKey: `gmail:inbound:${raw.id}` });
  if (asksToStop(message.bodyText)) {
    await registry.request('/opt-outs', { email: message.fromEmail, reason: 'Contact requested no further outreach', sourceMessageId: raw.id, idempotencyKey: `gmail:opt-out:${raw.id}` });
  }
  return 'recorded';
}

export function parseDeliveryFailure(message) {
  if (!/^(?:mailer-daemon|postmaster)@(?:googlemail\.com|gmail\.com)$/.test(message.fromEmail ?? '') ||
      !/delivery status|message not delivered|message blocked|mail delivery|undeliver/i.test(message.subject)) return null;
  const diagnostic = message.bodyText.match(/\b([45]\d\d(?:\s+[245]\.\d\.\d)?)\s*:?[ \t]*([^\r\n]{0,200})/i);
  if (!diagnostic) return null;
  const recipients = [...new Set((message.bodyText.match(/[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [])
    .map((value) => value.toLowerCase()).filter((value) => value !== SENDER && !/^(?:mailer-daemon|postmaster)@/.test(value)))];
  if (!recipients.length) return null;
  return { recipients, smtpStatus: diagnostic[1].replace(/\s+/, ' '), diagnostic: `${diagnostic[1]} ${diagnostic[2]}`.trim().slice(0, 500) };
}

export async function pollReplies(gmail, registry) {
  const profile = await gmail.profile();
  const cursor = await registry.request('/mailbox/cursor');
  const ids = new Set();
  let nextHistoryId = profile.historyId;
  if (!cursor) {
    let pageToken = null;
    for (let page = 0; page < 100; page++) {
      const result = await gmail.listSent(pageToken);
      for (const message of result.messages ?? []) ids.add(message.id);
      pageToken = result.nextPageToken ?? null;
      if (!pageToken) break;
      if (page === 99) throw new Error('Initial Sent sync exceeds 10000 messages; cursor left unchanged');
    }
    pageToken = null;
    for (let page = 0; page < 10; page++) {
      const result = await gmail.listInbox(pageToken);
      for (const message of result.messages ?? []) ids.add(message.id);
      pageToken = result.nextPageToken ?? null;
      if (!pageToken) break;
      if (page === 9) throw new Error('Initial inbox sync exceeds 1000 messages; cursor left unchanged');
    }
  } else {
    let pageToken = null;
    do {
      const result = await gmail.history(cursor.history_id, pageToken);
      for (const entry of result.history ?? []) {
        for (const item of entry.messagesAdded ?? []) ids.add(item.message.id);
      }
      nextHistoryId = result.historyId ?? nextHistoryId;
      pageToken = result.nextPageToken ?? null;
    } while (pageToken);
  }
  const outcomes = [];
  for (const id of ids) outcomes.push({ id, status: await ingest(id, gmail, registry) });
  await registry.request('/mailbox/cursor', { historyId: String(nextHistoryId), idempotencyKey: `gmail:cursor:${nextHistoryId}` });
  return { processed: outcomes.length, recorded: outcomes.filter((item) => item.status === 'recorded').length,
    humanTakeovers: outcomes.filter((item) => item.status === 'human-takeover').length,
    deliveryFailures: outcomes.filter((item) => item.status === 'delivery-failure').length, outcomes };
}
