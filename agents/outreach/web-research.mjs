const SEARCHES = [
  { sector: 'small restaurants, cafes, caterers and bakeries on Live Profiles, AfricaBizInfo or SA Online Directory with a public email and no dedicated website across South Africa', directory: true },
  { sector: 'independent plumbers, electricians, repair shops and other trades on Live Profiles, AfricaBizInfo or SA Online Directory with a public email and no dedicated website across South Africa', directory: true },
  { sector: 'local salons, spas, retailers and boutiques on Live Profiles, AfricaBizInfo or SA Online Directory with a public email and no dedicated website across South Africa', directory: true },
  { sector: 'small guest houses, studios and professional services on Live Profiles, AfricaBizInfo or SA Online Directory with a public email and no dedicated website across South Africa', directory: true },
  { sector: 'restaurants, cafes, caterers and local shops across South African provinces', directory: false },
  { sector: 'trades, studios, guest houses and professional services across South African provinces', directory: false },
];

function outputText(response) {
  return (response.output ?? []).filter((item) => item.type === 'message')
    .flatMap((item) => item.content ?? []).filter((part) => part.type === 'output_text')
    .map((part) => part.text).join('\n');
}

export function parseWebResearch(text) {
  const raw = String(text ?? '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const candidates = JSON.parse(raw).candidates;
  if (!Array.isArray(candidates) || candidates.length > 10) throw new Error('Web research candidate count is invalid');
  return candidates;
}

export async function forcedWebResearch({ apiKey, organizationId, projectId, known = [], fetcher = fetch }) {
  const groups = await Promise.allSettled(SEARCHES.map(async ({ sector, directory }) => {
    const sourceRule = directory
      ? 'Return only exact public business directory listings that visibly give both the business email and either the words “there is no website listed,” a Facebook page as its website, or the field “Open Website” followed by “Not provided.” Prioritize live-profiles.com/ZA pages when both Email Address and Open Website fields are present. Set websiteUrl to null. Never infer absence of a website from search results.'
      : 'Return only the business’s own HTTPS website pages. Do not return directory, social-media, search-result, or third-party pages. The live site must visibly say coming soon, under construction, or under maintenance and visibly give a business email on the same site. Set websiteUrl to the business site.';
    const input = `Use live web search to find up to 8 real ${sector}. Search across provinces, not just one city. Give priority to small independent businesses. Larger businesses are eligible with a specific verified fit. ${sourceRule} Search beyond these already known pages: ${JSON.stringify(known.slice(-150))}. Return only JSON in this shape: {"candidates":[{"companyName":"name","websiteUrl":"HTTPS site URL or null","contactEmail":"public email","contactSourceUrl":"exact HTTPS page showing email","observationUrl":"exact HTTPS page showing opportunity","evidenceText":"exact visible excerpt of 20 to 220 characters","finding":"specific respectful opportunity based only on that excerpt","offeringCode":"website-redesign"}]}. Never invent an email, URL or quote. Exclude businesses without the exact evidence. Do not send mail.`;
    const response = await fetcher('https://api.openai.com/v1/responses', {
      method: 'POST', signal: AbortSignal.timeout(150000),
      headers: { Authorization: `Bearer ${apiKey}`, 'OpenAI-Organization': organizationId,
        ...(projectId ? { 'OpenAI-Project': projectId } : {}), 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-6-luna', tools: [{ type: 'web_search' }],
        tool_choice: 'required', input }),
    });
    if (!response.ok) throw new Error(`Forced web search failed (${response.status})`);
    const result = await response.json();
    if (result.status !== 'completed' || !result.output?.some((item) => item.type === 'web_search_call')) {
      throw new Error('Live web search did not complete');
    }
    return parseWebResearch(outputText(result));
  }));
  const candidates = [], seen = new Set();
  let failures = 0;
  for (const group of groups) {
    if (group.status === 'rejected') { failures++; continue; }
    for (const candidate of group.value) {
      const email = String(candidate?.contactEmail ?? '').trim().toLowerCase();
      if (!email || seen.has(email)) continue;
      seen.add(email);
      candidates.push(candidate);
    }
  }
  if (failures === SEARCHES.length) throw new Error('All live web searches failed');
  return { candidates: candidates.slice(0, 50), searches: SEARCHES.length, failures };
}
