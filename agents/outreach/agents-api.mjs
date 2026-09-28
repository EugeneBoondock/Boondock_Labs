import { AGENT_IDS, requiredText } from './rules.mjs';

export const AGENT_INSTRUCTIONS = Object.freeze({
  'lead-research': 'Research business leads from verifiable public sources. Identify specific dated observations on old or poorly designed sites without insults or unsupported defect claims. Return company, site, contact, source URL, observation date, finding, and only relevant offering codes: website-redesign, whatsapp-ai-agent, website-ai-chat, android-ios-app. Never invent a contact or email. Never send messages or propose repeat cold contact to a business.',
  outreach: 'Draft one short, specific initial email from Eugene at Boondock Labs to an approved business. Use only verified dated findings in the supplied record. Mention only relevant services: redesigned sites, WhatsApp customer AI agents, website AI chat, Android or iOS apps. Include an easy way to opt out. Never draft a reminder, nudge, sequence, or follow-up for silence. Return subject and plain text body as JSON without a signature; the sender appends Eugene’s signature. Do not send messages.',
  'reply-quotation': 'Read one stored inbound prospect reply and propose at most one response for that message. Wait for another inbound message before proposing another reply. For a quote gather complete scope relevant to the requested website, WhatsApp AI agent, website AI chat, or Android/iOS app service, including features, design or data sources, hosting or backend, timeline, connections, handoff, and ongoing support as applicable. Research current South African market pricing from public source URLs, state observed prices and dates, and cite evidence without copying competitor text. Use supplied Boondock pricing bounds and clear assumptions. Unknown scope, evidence, or price requires clarification or Eugene review; do not invent rates. Quote in ZAR with expiry. Give WhatsApp Business +27 81 628 8767 only if that inbound message expressly asks for phone or WhatsApp details. Return JSON with plain text body and no signature; the sender appends Eugene’s signature. Do not send messages.',
});

export class AgentsApi {
  constructor({ apiKey, organizationId, projectId = null, savedAgentIds, sessionIds = {}, fetcher = fetch }) {
    this.apiKey = requiredText(apiKey, 'OpenAI API key', 500);
    this.organizationId = requiredText(organizationId, 'Earthie organization ID', 100);
    if (!/^org-[A-Za-z0-9_-]+$/.test(this.organizationId)) throw new Error('Invalid Earthie organization ID');
    this.projectId = projectId;
    this.savedAgentIds = savedAgentIds ?? {};
    this.sessionIds = sessionIds;
    this.fetcher = fetcher;
  }

  headers(json = false) {
    return { Authorization: `Bearer ${this.apiKey}`, 'OpenAI-Organization': this.organizationId,
      ...(this.projectId ? { 'OpenAI-Project': this.projectId } : {}), 'OpenAI-Beta': 'agents=v1',
      ...(json ? { 'Content-Type': 'application/json' } : {}) };
  }

  async verifyModelAccess() {
    const response = await this.fetcher('https://api.openai.com/v1/models/gpt-6-luna', { headers: this.headers() });
    if (!response.ok) throw new Error(`Earthie GPT-6 Luna access check failed (${response.status})`);
    const model = await response.json();
    if (model.id !== 'gpt-6-luna') throw new Error('Unexpected model access response');
    return true;
  }

  async listSavedAgents() {
    const response = await this.fetcher('https://api.openai.com/v1/agents?limit=100', {
      headers: this.headers(),
    });
    if (!response.ok) throw new Error(`Agents API list failed (${response.status})`);
    const result = await response.json();
    if (result.has_more) throw new Error('Agent list pagination requires review before bootstrap');
    return result.data ?? [];
  }

  async verifySavedAgents() {
    await this.verifyModelAccess();
    const mapping = {};
    for (const role of AGENT_IDS) {
      const agent = await this.savedAgent(role);
      mapping[role] = agent.id;
    }
    return mapping;
  }

  async savedAgent(role) {
    if (!AGENT_IDS.includes(role)) throw new Error('Invalid agent role');
    const agentId = this.savedAgentIds[role];
    if (!agentId) throw new Error(`Saved agent ID missing for ${role}`);
    const response = await this.fetcher(`https://api.openai.com/v1/agents/${encodeURIComponent(agentId)}`, { headers: this.headers() });
    if (!response.ok) throw new Error(`Saved Earthie agent lookup failed (${response.status})`);
    const agent = await response.json();
    if (agent.id !== agentId || agent.model !== 'gpt-6-luna' || (agent.metadata?.boondock_role && agent.metadata.boondock_role !== role)) throw new Error('Saved agent does not match Earthie role');
    return agent;
  }

  async existingSession(role) {
    const agent = await this.savedAgent(role);
    const sessionId = this.sessionIds[role];
    if (!/^sess_[A-Za-z0-9_-]+$/.test(sessionId ?? '')) throw new Error(`Saved self-hosted session ID missing for ${role}`);
    const response = await this.fetcher(`https://api.openai.com/v1/agents/sessions/${encodeURIComponent(sessionId)}`, { headers: this.headers() });
    if (!response.ok) throw new Error(`Saved session lookup failed (${response.status})`);
    const session = await response.json();
    if (session.id !== sessionId || session.environment?.type !== 'self_hosted' ||
      (session.agent?.id ?? session.agent_id) !== agent.id || session.agent?.model !== 'gpt-6-luna') {
      throw new Error('Saved session identity mismatch');
    }
    return session;
  }

  async latestTurn(sessionId) {
    const response = await this.fetcher(`https://api.openai.com/v1/agents/sessions/${encodeURIComponent(sessionId)}/turns?order=desc&limit=1`, { headers: this.headers() });
    if (!response.ok) throw new Error(`Session turn lookup failed (${response.status})`);
    return (await response.json()).data?.[0] ?? null;
  }

  async runExistingSession(role, input, idempotencyKey) {
    const session = await this.existingSession(role);
    if (session.status !== 'idle') throw new Error(`Saved session is ${session.status}, expected idle`);
    const previousTurnId = (await this.latestTurn(session.id))?.id ?? null;
    const response = await this.fetcher(`https://api.openai.com/v1/agents/sessions/${encodeURIComponent(session.id)}/events`, {
      method: 'POST', headers: this.headers(true), body: JSON.stringify({
        events: [{ type: 'agent.session.input.message', input: [{ role: 'user', content: [{ type: 'input_text',
          text: requiredText(input, 'agent input', 30000) }] }] }] }),
    });
    if (response.status !== 202) {
      const detail = await response.json().catch(() => null);
      throw new Error(`Saved session input rejected (${response.status}): ${String(detail?.error?.message ?? 'unknown validation error').slice(0, 300)}`);
    }
    try {
      for (let attempt = 0; attempt < 120; attempt++) {
        const turn = await this.latestTurn(session.id);
        if (turn && turn.id !== previousTurnId && ['completed','failed','cancelled'].includes(turn.status)) {
          return { sessionId: session.id, turnId: turn.id, status: turn.status, error: turn.error?.message ?? null };
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
      throw new Error('Saved session accepted input but turn outcome is pending; reconcile before retrying');
    } catch (error) {
      error.outcomeUnknown = true;
      throw error;
    }
  }
}

export async function consumeAgentStream(stream, onEvent) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });
      const frames = buffer.split(/\r?\n\r?\n/);
      buffer = frames.pop() ?? '';
      for (const frame of frames) {
        const data = frame.split(/\r?\n/).filter((line) => line.startsWith('data:')).map((line) => line.slice(5).trimStart()).join('\n');
        if (data && data !== '[DONE]') await onEvent(JSON.parse(data));
      }
      if (done) break;
    }
  } finally {
    reader.releaseLock();
  }
}

export async function runSavedAgent({ role, input, idempotencyKey, registry, agentsApi, trigger = 'manual' }) {
  const run = await registry.request('/runs', { agentId: role, trigger, idempotencyKey });
  if (run.status !== 'queued') return run;
  await registry.request(`/runs/${run.id}/status`, { status: 'running', idempotencyKey: `${idempotencyKey}:running` });
  let sessionId = agentsApi.sessionIds[role] ?? null;
  try {
    if (!sessionId) throw new Error('Saved self-hosted session mapping is missing');
    await registry.request(`/runs/${run.id}/session`, { idempotencyKey: `${idempotencyKey}:session`, externalRunId: sessionId });
    const result = await agentsApi.runExistingSession(role, input, idempotencyKey);
    const outcome = result.status === 'completed' ? 'succeeded' : result.status;
    return registry.request(`/runs/${run.id}/status`, { status: outcome, idempotencyKey: `${idempotencyKey}:${outcome}`, externalRunId: sessionId });
  } catch (error) {
    if (error.outcomeUnknown) throw error;
    await registry.request(`/runs/${run.id}/status`, { status: 'failed', idempotencyKey: `${idempotencyKey}:failed`,
      externalRunId: sessionId, errorSummary: error.message.slice(0, 500) });
    throw error;
  }
}
