# Boondock Labs Cloudflare migration record

## Hosting inventory

| Item | Value |
| --- | --- |
| Public domain | `boondocklabs.co.za` |
| Canonical site | `https://www.boondocklabs.co.za` |
| Registrar | Truehost, domain ID `15666` |
| Former DNS | `ns1.vercel-dns.com`, `ns2.vercel-dns.com` |
| Cloudflare DNS | `lynn.ns.cloudflare.com`, `treasure.ns.cloudflare.com` |
| Cloudflare account | `e31feaa4cca751cc2db46646c505f63b` |
| Cloudflare zone | `4c066e13c4d1021ff7ad2feb25f58fe9` |
| Worker | `boondock-labs-site` |
| Worker staging URL | `https://boondock-labs-site.boondock-labs-ltd.workers.dev` |
| D1 database | `boondock-labs-outreach`, ID `01a355bf-a7fa-48d3-8708-d615397301f7` |
| Former Vercel team and project | `eugeneboondocks-projects/boondock-labs` |

The Worker’s `OUTREACH_DB` binding points to the existing D1 database. Migrations `001_outreach_registry.sql` and `002_outreach_support.sql` were applied to that database before the binding was deployed. Do not reapply them without checking the remote migration state.

## DNS transfer

The following records were compared directly against the Vercel and Cloudflare authoritative nameservers on 27 September 2026:

| Name and type | Value or status |
| --- | --- |
| Apex MX | Priority 1, `smtp.google.com`, unchanged |
| Apex SPF TXT | `v=spf1 include:_spf.google.com ~all`, unchanged |
| Apex Google verification TXT | `google-site-verification=8kYz0NNZY6D96cLM-87QMcV9z9wSibFoSrsHwQUUv00`, unchanged |
| `google._domainkey` TXT | 408 characters, SHA-256 `7265ec02f84cafc085ad988376f99c4495264399577111cc436162c6763c4955`, unchanged |
| `_dmarc` TXT | Absent at both providers |
| Apex CAA | The original `letsencrypt.org`, `pki.goog`, and `sectigo.com` issuer rows were copied into the zone. Cloudflare’s authoritative answer has 11 entries, including its generated issuers and a `pki.goog; cansignhttpexchanges=yes` variant. Its answer is not a byte-for-byte copy of Vercel’s three entries. |
| Apex and `www` web targets | Moved from Vercel aliases to proxied Cloudflare Worker records |
| Vercel wildcard web alias | Deliberately omitted because it pointed arbitrary subdomains to Vercel. Unknown subdomains now have no A record unless explicitly created. No named mail service used that wildcard. |
| `outreach` A | Added as proxied `74.91.160.168` for the Network Solutions VPS. No AAAA record was added. |

Cloudflare’s proxied apex and `www` records answer with Cloudflare IPv4 and IPv6 addresses. The old Vercel apex and wildcard aliases must not be copied as origins. Google Workspace mail delivery uses the unchanged apex MX, SPF, DKIM, and verification records.

## Deploy and rollback

Build and deploy with `npm run build:cloudflare` followed by `npx wrangler deploy`. The `OPENAI_API_KEY` production secret is stored in Cloudflare and must not be copied into this repository. `CF_ACCESS_TEAM_DOMAIN` and `CF_ACCESS_AUD` are required before the private admin routes can authenticate. Admin routes deny access when their Access settings are absent.

The former Vercel project was `eugeneboondocks-projects/boondock-labs`, with `www.boondocklabs.co.za` as its production domain and the apex redirecting to `www`. A signed-in Vercel search on 27 September 2026 found that project already deleted, with no project using the team domain. Restoring Vercel hosting would require a fresh deployment and domain assignment; changing nameservers back alone would not restore the site. Do not change the registrar nameservers or Vercel DNS without a new user direction.

On 27 September 2026, the .co.za registry and its parent DNS servers changed to the two Cloudflare nameservers, and the Cloudflare zone became Active. The Cloudflare edge presents a valid Let’s Encrypt certificate for the apex and `*.boondocklabs.co.za`; direct Cloudflare HTTPS tests passed for the public pages, chat, and apex redirect. Unauthenticated admin routes redirect to Cloudflare Access.

Some recursive resolvers retain Vercel nameservers from their prior delegation cache. Before a stop instruction arrived, two explicit records were saved in the remaining Vercel team DNS zone: a `www` CNAME and apex ALIAS to `boondock-labs-site.boondock-labs-ltd.workers.dev.`, each with TTL 60 seconds. The default Vercel aliases were left untouched. Direct queries to both old Vercel nameservers now return the Worker target, and Cloudflare’s `1.1.1.1` resolver returns Cloudflare Worker addresses even though its nameserver cache still lists Vercel. These DNS records do not recreate or run the deleted Vercel project. Cached old Vercel A answers can still return a Vercel 404 until their TTL expires. No further Vercel changes are authorized under the current instruction.
