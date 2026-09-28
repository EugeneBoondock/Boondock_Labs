import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const wrangler = resolve(root, 'node_modules/wrangler/bin/wrangler.js');
const database = 'boondock-labs-outreach';
const migrations = ['migrations/001_outreach_registry.sql', 'migrations/002_outreach_support.sql', 'migrations/003_outreach_contact_limits.sql',
  'migrations/004_outreach_takeover.sql', 'migrations/005_outreach_delivery_failures.sql',
  'migrations/006_outreach_verified_market_quotes.sql'];

function execute(statement) {
  const result = spawnSync(process.execPath, [wrangler, 'd1', 'execute', database, '--remote', '--command', statement, '--json'], {
    cwd: root, encoding: 'utf8', maxBuffer: 1024 * 1024,
  });
  if (result.status !== 0) throw new Error((result.stderr || result.stdout || 'Wrangler failed').slice(0, 1500));
  const parsed = JSON.parse(result.stdout);
  if (!Array.isArray(parsed) || parsed.some((item) => !item.success)) throw new Error('D1 reported an unsuccessful query');
  return parsed[0].results;
}

if (!process.argv.includes('--verify-only')) {
  for (const file of migrations.filter((item) => !process.argv.includes('--only-new') || /\/006_/.test(item))) {
    const source = readFileSync(resolve(root, file), 'utf8');
    const statements = source.split(';').map((part) => part.trim()).filter(Boolean);
    for (let index = 0; index < statements.length; index++) {
      execute(`${statements[index]};`);
      process.stdout.write(`${file} statement ${index + 1}/${statements.length} applied\n`);
    }
  }
}

const tables = execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%' ORDER BY name").map((row) => row.name);
const agents = execute('SELECT id, model, enabled FROM outreach_agents ORDER BY id');
const expectedTables = ['activity_events','admin_handoffs','agent_runs','contact_suppression_keys','delivery_failures','mailbox_cursors',
  'outreach_agents','outreach_messages','outreach_opt_outs','prospect_business_keys','prospects','quote_documents','quote_items','quotes','sent_mail_observations'];
const quoteTable = execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='quote_items'")[0]?.sql ?? '';
if (JSON.stringify(tables) !== JSON.stringify(expectedTables) || agents.length !== 3 ||
    agents.some((agent) => agent.model !== 'gpt-6-luna') || !quoteTable.includes('verified_market')) {
  throw new Error('Remote D1 verification did not match the outreach schema');
}
process.stdout.write(`Verified ${tables.length} tables, verified-market quote pricing, and ${agents.length} GPT-6 Luna agent rows.\n`);
