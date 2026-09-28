import { createInterface } from 'node:readline';

const baseUrl = process.argv[2];
if (!baseUrl || new URL(baseUrl).protocol !== 'https:') throw new Error('HTTPS registry URL required');

const input = createInterface({ input: process.stdin, terminal: false });
input.once('line', async (line) => {
  input.close();
  try {
    const token = line.trim();
    if (token.length < 40) throw new Error('Private service token missing');
    const denied = await fetch(`${baseUrl}/agents`);
    if (denied.status !== 403) throw new Error(`Unauthenticated request returned ${denied.status}`);
    const allowed = await fetch(`${baseUrl}/agents`, { headers: { Authorization: `Bearer ${token}` } });
    if (!allowed.ok) throw new Error(`Authenticated request returned ${allowed.status}`);
    const agents = await allowed.json();
    if (!Array.isArray(agents) || agents.length !== 3 || agents.some((agent) => agent.enabled !== 0)) {
      throw new Error('Registry agent rows did not match the disabled deployment state');
    }
    process.stdout.write('Registry auth passed; three agent rows remain disabled.\n');
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
});
