export const AGENT_IDS = Object.freeze(['lead-research', 'outreach', 'reply-quotation']);
export const SENDER = 'eugene@boondocklabs.co.za';
export const STAGES = Object.freeze(['new', 'qualified', 'contacted', 'replied', 'quoted', 'won', 'lost']);

export function requiredText(value, field, max = 4000) {
  if (typeof value !== 'string' || !value.trim() || value.length > max) throw new Error(`Invalid ${field}`);
  return value.trim();
}

export function normalizeEmail(value) {
  if (value == null || value === '') return null;
  const email = requiredText(value, 'email', 320).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid email');
  return email;
}

export function businessKeys(companyName, websiteUrl) {
  const companyKey = requiredText(companyName, 'company name', 200).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  if (!companyKey) throw new Error('Company name needs letters or numbers');
  let domainKey = null;
  if (websiteUrl) {
    const site = new URL(websiteUrl);
    if (!['http:', 'https:'].includes(site.protocol) || !site.hostname.includes('.')) throw new Error('Invalid website URL');
    domainKey = site.hostname.toLowerCase().replace(/^www\./, '');
  }
  return { companyKey, domainKey };
}

export function dayKey(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) throw new Error('Invalid time');
  return date.toISOString().slice(0, 10);
}

export function validateStage(current, next) {
  const allowed = {
    new: ['qualified', 'lost'], qualified: ['contacted', 'lost'],
    contacted: ['replied', 'lost'], replied: ['quoted', 'lost'],
    quoted: ['won', 'lost'], won: [], lost: [],
  };
  if (!allowed[current]?.includes(next)) throw new Error(`Stage transition ${current} to ${next} is not allowed`);
}

export function priceQuote(items, catalog, maxAmountMinor) {
  if (!Array.isArray(items) || items.length < 1 || items.length > 30) throw new Error('Quote needs 1 to 30 items');
  const priced = items.map((item) => {
    const code = requiredText(item.code, 'service code', 80);
    const description = requiredText(item.description, 'description', 500);
    const quantity = item.quantity;
    if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 1000) throw new Error('Invalid quantity');
    const rule = catalog?.[code];
    const valid = rule && Number.isSafeInteger(rule.unitPriceMinor) && rule.unitPriceMinor >= 0 &&
      quantity >= (rule.minQuantity ?? 1) && quantity <= (rule.maxQuantity ?? 1000);
    const unitPriceMinor = valid ? rule.unitPriceMinor : null;
    const lineTotalMinor = unitPriceMinor === null ? null : unitPriceMinor * quantity;
    if (lineTotalMinor !== null && !Number.isSafeInteger(lineTotalMinor)) throw new Error('Quote amount overflow');
    return { code, description, quantity, unitPriceMinor, lineTotalMinor, pricingSource: valid ? 'catalog' : 'review' };
  });
  const needsReview = priced.some((item) => item.pricingSource === 'review');
  const amountMinor = needsReview ? 0 : priced.reduce((sum, item) => sum + item.lineTotalMinor, 0);
  if (!Number.isSafeInteger(amountMinor) || amountMinor > maxAmountMinor) throw new Error('Quote exceeds allowed amount');
  return { items: priced, amountMinor, needsReview };
}

export function approveQuoteItems(items, approvedPrices, maxAmountMinor) {
  if (!Array.isArray(items) || !Array.isArray(approvedPrices) || items.length !== approvedPrices.length) throw new Error('Prices must match quote items');
  const result = items.map((item, index) => {
    const unitPriceMinor = item.unit_price_minor ?? approvedPrices[index];
    if (!Number.isSafeInteger(unitPriceMinor) || unitPriceMinor < 0) throw new Error('Invalid approved price');
    const lineTotalMinor = unitPriceMinor * item.quantity;
    if (!Number.isSafeInteger(lineTotalMinor)) throw new Error('Quote amount overflow');
    return { ...item, unitPriceMinor, lineTotalMinor };
  });
  const amountMinor = result.reduce((sum, item) => sum + item.lineTotalMinor, 0);
  if (!Number.isSafeInteger(amountMinor) || amountMinor > maxAmountMinor) throw new Error('Quote exceeds allowed amount');
  return { items: result, amountMinor };
}

export const SERVICE_SCOPE_FIELDS = Object.freeze({
  'website-redesign': ['siteType','pagesFeatures','designContent','hosting','timeline','integrations','ongoingSupport'],
  'whatsapp-ai-agent': ['conversationVolume','dataSources','handoff','integrations','timeline','hosting','ongoingSupport'],
  'website-ai-chat': ['websitePlatform','conversationVolume','knowledgeSources','handoff','integrations','timeline','ongoingSupport'],
  'android-ios-app': ['platforms','screensFeatures','designContent','backend','timeline','integrations','ongoingSupport'],
});

export function validateLeadObservations(observations, currentTime = Date.now()) {
  if (!Array.isArray(observations) || observations.length < 1 || observations.length > 10) throw new Error('A dated public opportunity observation is required');
  return observations.map((item) => {
    const source = new URL(item.sourceUrl);
    const observedAt = new Date(item.observedAt).getTime();
    if (source.protocol !== 'https:' || !source.hostname.includes('.') || !Number.isFinite(observedAt) || observedAt > currentTime || currentTime - observedAt > 90 * 86400000) throw new Error('Observation needs a recent public HTTPS source');
    if (!Object.hasOwn(SERVICE_SCOPE_FIELDS, item.offeringCode)) throw new Error('Invalid service offering');
    return { sourceUrl: source.href, observedAt: new Date(observedAt).toISOString(), finding: requiredText(item.finding, 'specific observation', 500), offeringCode: item.offeringCode };
  });
}

export function assessQuoteContext(scope, benchmarks, assumptions, currentTime = Date.now()) {
  const cleanScope = {};
  const missing = [];
  const serviceCode = scope?.serviceCode;
  if (!Object.hasOwn(SERVICE_SCOPE_FIELDS, serviceCode)) missing.push('serviceCode');
  else cleanScope.serviceCode = serviceCode;
  for (const field of SERVICE_SCOPE_FIELDS[serviceCode] ?? []) {
    const value = typeof scope?.[field] === 'string' ? scope[field].trim() : '';
    if (!value || value.length > 500) missing.push(field);
    else cleanScope[field] = value;
  }
  const cleanAssumptions = typeof assumptions === 'string' && assumptions.trim().length <= 1500 ? assumptions.trim() : '';
  if (!cleanAssumptions) missing.push('assumptions');
  const sources = [];
  for (const item of Array.isArray(benchmarks) ? benchmarks.slice(0, 10) : []) {
    try {
      const url = new URL(item.sourceUrl);
      const observedAt = new Date(item.observedAt).getTime();
      if (url.protocol !== 'https:' || !url.hostname.includes('.') || !Number.isFinite(observedAt) || observedAt > currentTime || currentTime - observedAt > 90 * 86400000) continue;
      if (item.currency !== 'ZAR' || !Number.isSafeInteger(item.minAmountMinor) || !Number.isSafeInteger(item.maxAmountMinor) || item.minAmountMinor < 0 || item.maxAmountMinor < item.minAmountMinor) continue;
      sources.push({ sourceUrl: url.href, observedAt: new Date(observedAt).toISOString(), currency: 'ZAR', minAmountMinor: item.minAmountMinor,
        maxAmountMinor: item.maxAmountMinor, comparableScope: requiredText(item.comparableScope, 'comparable scope', 500) });
    } catch { /* Invalid evidence stays pending review. */ }
  }
  if (new Set(sources.map((item) => new URL(item.sourceUrl).hostname)).size < 2) missing.push('two recent South African market sources');
  return { scope: cleanScope, benchmarks: sources, assumptions: cleanAssumptions, missing, complete: missing.length === 0 };
}
