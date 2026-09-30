const DIRECTORY = 'https://live-profiles.com/directory';
const PROFILE = /^https:\/\/live-profiles\.com\/ZA[A-Z0-9]{2}-[A-Z0-9]{5}$/i;

export function parseDirectoryCandidate(markdown, url) {
  if (!PROFILE.test(url) || typeof markdown !== 'string') return null;
  const lines = markdown.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const name = lines.find((line) => /^# [^#]/.test(line))?.slice(2).trim();
  const start = lines.findIndex((line) => /Contact & Location/.test(line));
  const end = lines.findIndex((line, index) => index > start && /About This Business/.test(line));
  if (!name || start < 0 || end < start) return null;
  const section = lines.slice(start, end);
  function field(label) {
    const index = section.findIndex((line) => line.includes(label));
    return index < 0 ? null : section[index + 1] ?? null;
  }
  const email = field('Email Address')?.match(/[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0]?.toLowerCase();
  const website = field('Open Website');
  const city = field('City / Town');
  if (!email || website !== 'Not provided' || !city || city === 'Not provided' ||
    field('Country') !== 'South Africa' || /^(?:not applicable|none|unknown)$/i.test(name)) return null;
  return { companyName: name, websiteUrl: null, contactEmail: email,
    contactSourceUrl: url, observationUrl: url,
    evidenceText: 'Open Website Not provided',
    finding: `The public business listing for ${name} in ${city} has no website entered in its website field. A dedicated site could make its services easier to find and enquire about.`,
    offeringCode: 'website-redesign' };
}

export async function cloudflareDirectoryResearch({ registry, offset = 0, pageLimit = 50,
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)) }) {
  if (!Number.isSafeInteger(offset) || offset < 0 || !Number.isSafeInteger(pageLimit) || pageLimit < 1 || pageLimit > 250) {
    throw new Error('Invalid directory scan range');
  }
  const index = await registry.request('/research/render', { url: DIRECTORY, action: 'links' });
  if (!index.success || !Array.isArray(index.result)) throw new Error('Directory links were not rendered');
  const links = [...new Set(index.result.filter((url) => typeof url === 'string' && PROFILE.test(url)))];
  const candidates = [];
  const selected = links.slice(offset, offset + pageLimit);
  let failed = 0;
  for (const url of selected) {
    try {
      const page = await registry.request('/research/render', { url, action: 'markdown' });
      if (!page.success || typeof page.result !== 'string') throw new Error('Directory profile did not render');
      const candidate = parseDirectoryCandidate(page.result, url);
      if (candidate) candidates.push(candidate);
    } catch { failed++; }
    await sleep(1100);
  }
  return { candidates, scanned: selected.length, failed, nextOffset: offset + selected.length,
    totalLinks: links.length, exhausted: offset + selected.length >= links.length };
}
