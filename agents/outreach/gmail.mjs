import { Buffer } from 'node:buffer';
import { SENDER, normalizeEmail, requiredText } from './rules.mjs';

const API = 'https://gmail.googleapis.com/gmail/v1/users/me';
export const SIGNATURE_SITE = 'https://www.boondocklabs.co.za';
export const SIGNATURE_LOGO = `${SIGNATURE_SITE}/boondock-mark.png`;
export const SIGNATURE_TEXT = `Eugene\nBoondock Labs\n${SIGNATURE_SITE}\n${SENDER}`;

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function encodedLines(value) {
  return Buffer.from(value, 'utf8').toString('base64').match(/.{1,76}/g)?.join('\r\n') ?? '';
}

export function signedBodies(text) {
  const body = requiredText(text, 'body', 100000).trimEnd();
  const plain = body.endsWith(SIGNATURE_TEXT) ? body : `${body}\n\n${SIGNATURE_TEXT}`;
  const messageHtml = escapeHtml(body.endsWith(SIGNATURE_TEXT) ? body.slice(0, -SIGNATURE_TEXT.length).trimEnd() : body).replace(/\r?\n/g, '<br>');
  const html = `<!doctype html><html><body><div>${messageHtml}</div><table role="presentation" bgcolor="#f5f0e6" cellpadding="0" cellspacing="0" style="margin-top:18px;border-collapse:collapse;background:#f5f0e6;font-family:Arial,sans-serif;font-size:13px;line-height:1.5;color:#20221f"><tr><td bgcolor="#f5f0e6" style="background:#f5f0e6;padding:7px;border-radius:6px"><img src="${SIGNATURE_LOGO}" width="64" height="64" alt="Boondock Labs" style="display:block;border:0;width:64px;height:64px"></td><td bgcolor="#f5f0e6" style="background:#f5f0e6;padding:7px 10px"><strong style="font-size:14px;color:#20221f">Eugene</strong><br><span style="color:#20221f">Boondock Labs</span><br><a href="${SIGNATURE_SITE}" style="color:#8a4a05">www.boondocklabs.co.za</a><br><a href="mailto:${SENDER}" style="color:#8a4a05">${SENDER}</a></td></tr></table></body></html>`;
  return { plain, html };
}

function safeHeader(value, field, max = 998) {
  const text = requiredText(value, field, max);
  if (/[\r\n\x00-\x1f]/.test(text)) throw new Error(`Invalid ${field}`);
  return text;
}

function encodeHeader(value) {
  return /[^\x20-\x7e]/.test(value) ? `=?UTF-8?B?${Buffer.from(value, 'utf8').toString('base64')}?=` : value;
}

function base64Url(bytes) {
  return Buffer.from(bytes).toString('base64url');
}

function decodeUrl(value) {
  return Buffer.from(value ?? '', 'base64url').toString('utf8');
}

function header(message, name) {
  return message.payload?.headers?.find((item) => item.name.toLowerCase() === name.toLowerCase())?.value ?? '';
}

export function sentRecipients(message) {
  const values = ['To', 'Cc', 'Bcc'].map((name) => header(message, name)).join(',');
  return [...new Set((values.match(/[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [])
    .map((value) => normalizeEmail(value)))];
}

function bodyText(part) {
  if (part?.mimeType === 'text/plain' && part.body?.data) return decodeUrl(part.body.data);
  for (const child of part?.parts ?? []) {
    const text = bodyText(child);
    if (text) return text;
  }
  return '';
}

export function parseGmailMessage(message) {
  const from = normalizeEmail((header(message, 'From').match(/<([^>]+)>/) ?? [null, header(message, 'From')])[1]);
  const to = sentRecipients(message)[0] ?? null;
  return {
    provider: 'gmail', providerMessageId: message.id, providerThreadId: message.threadId,
    inReplyToId: header(message, 'In-Reply-To') || null,
    rfcMessageId: header(message, 'Message-ID') || null,
    fromEmail: from, toEmail: to, subject: header(message, 'Subject') || '(no subject)',
    bodyText: bodyText(message.payload) || message.snippet || '(empty message)',
    occurredAt: new Date(Number(message.internalDate)).toISOString(),
  };
}

export function buildMime({ to, subject, text, messageId, inReplyToId = null, pdf = null }) {
  const recipient = normalizeEmail(to);
  if (!recipient) throw new Error('Recipient required');
  const safeSubject = safeHeader(subject, 'subject');
  const safeMessageId = safeHeader(messageId, 'message ID', 255);
  if (!/^<[^<>\s]+@boondocklabs\.co\.za>$/.test(safeMessageId)) throw new Error('Invalid Message-ID');
  const lines = [
    `From: ${SENDER}`, `To: ${recipient}`, `Subject: ${encodeHeader(safeSubject)}`,
    `Message-ID: ${safeMessageId}`, 'MIME-Version: 1.0',
  ];
  if (inReplyToId) lines.push(`In-Reply-To: ${safeHeader(inReplyToId, 'In-Reply-To', 255)}`);
  const signed = signedBodies(text);
  const alternativeBoundary = `boondock-alt-${crypto.randomUUID()}`;
  const alternative = [
    `--${alternativeBoundary}`, 'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: base64', '', encodedLines(signed.plain),
    `--${alternativeBoundary}`, 'Content-Type: text/html; charset=UTF-8', 'Content-Transfer-Encoding: base64', '', encodedLines(signed.html),
    `--${alternativeBoundary}--`, '',
  ];
  if (pdf) {
    const boundary = `boondock-${crypto.randomUUID()}`;
    const filename = safeHeader(pdf.filename, 'filename', 100).replace(/[^A-Za-z0-9._-]/g, '_');
    if (!filename.endsWith('.pdf') || !Buffer.isBuffer(pdf.bytes) || pdf.bytes.length > 2000000) throw new Error('Invalid PDF attachment');
    lines.push(`Content-Type: multipart/mixed; boundary="${boundary}"`, '',
      `--${boundary}`, `Content-Type: multipart/alternative; boundary="${alternativeBoundary}"`, '', ...alternative,
      `--${boundary}`, `Content-Type: application/pdf; name="${filename}"`, 'Content-Transfer-Encoding: base64',
      `Content-Disposition: attachment; filename="${filename}"`, '', encodedLines(pdf.bytes),
      `--${boundary}--`, '');
  } else {
    lines.push(`Content-Type: multipart/alternative; boundary="${alternativeBoundary}"`, '', ...alternative);
  }
  return base64Url(Buffer.from(lines.join('\r\n'), 'utf8'));
}

export class GmailClient {
  constructor({ clientId, clientSecret, refreshToken, fetcher = fetch, allowSend = false }) {
    this.clientId = requiredText(clientId, 'Gmail client ID', 500);
    this.clientSecret = requiredText(clientSecret, 'Gmail client secret', 500);
    this.refreshToken = requiredText(refreshToken, 'Gmail refresh token', 5000);
    this.fetcher = fetcher;
    this.allowSend = allowSend;
    this.accessToken = null;
    this.expiresAt = 0;
  }

  async token() {
    if (this.accessToken && Date.now() < this.expiresAt - 60000) return this.accessToken;
    const response = await this.fetcher('https://oauth2.googleapis.com/token', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: this.clientId, client_secret: this.clientSecret, refresh_token: this.refreshToken, grant_type: 'refresh_token' }),
    });
    if (!response.ok) throw new Error(`Gmail OAuth refresh failed (${response.status})`);
    const data = await response.json();
    if (!data.access_token || !Number.isFinite(data.expires_in)) throw new Error('Gmail OAuth response incomplete');
    this.accessToken = data.access_token;
    this.expiresAt = Date.now() + data.expires_in * 1000;
    return this.accessToken;
  }

  async request(path, options = {}) {
    const response = await this.fetcher(`${API}${path}`, {
      ...options, headers: { Authorization: `Bearer ${await this.token()}`, Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}) },
    });
    if (!response.ok) {
      const error = new Error(`Gmail API failed (${response.status})`);
      error.status = response.status;
      throw error;
    }
    return response.json();
  }

  async profile() {
    const profile = await this.request('/profile');
    if (profile.emailAddress?.toLowerCase() !== SENDER) throw new Error('Gmail OAuth account mismatch');
    return profile;
  }

  async listInbox(pageToken = null) {
    const query = new URLSearchParams({ labelIds: 'INBOX', maxResults: '100' });
    if (pageToken) query.set('pageToken', pageToken);
    return this.request(`/messages?${query}`);
  }

  async listSent(pageToken = null, query = null) {
    const params = new URLSearchParams({ labelIds: 'SENT', maxResults: '100' });
    if (pageToken) params.set('pageToken', pageToken);
    if (query) params.set('q', query);
    return this.request(`/messages?${params}`);
  }

  async getMessage(id) {
    return this.request(`/messages/${encodeURIComponent(id)}?format=full`);
  }

  async history(startHistoryId, pageToken = null) {
    const query = new URLSearchParams({ startHistoryId, historyTypes: 'messageAdded', maxResults: '100' });
    if (pageToken) query.set('pageToken', pageToken);
    return this.request(`/history?${query}`);
  }

  async send({ to, subject, text, messageId, inReplyToId, threadId, pdf }) {
    if (!this.allowSend) throw new Error('Outbound Gmail send is disabled');
    await this.profile();
    const raw = buildMime({ to, subject, text, messageId, inReplyToId, pdf });
    return this.request('/messages/send', { method: 'POST', body: JSON.stringify({ raw, ...(threadId ? { threadId } : {}) }) });
  }
}
