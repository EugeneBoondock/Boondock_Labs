export class RegistryClient {
  constructor({ baseUrl, token, fetcher = fetch }) {
    const url = new URL(baseUrl);
    if (url.protocol !== 'https:') throw new Error('Registry API must use HTTPS');
    if (!token) throw new Error('Registry service token required');
    this.baseUrl = url.href.replace(/\/$/, '');
    this.token = token;
    this.fetcher = fetcher;
  }

  async request(path, value) {
    const response = await this.fetcher(`${this.baseUrl}${path}`, {
      method: value === undefined ? 'GET' : 'POST',
      headers: { Authorization: `Bearer ${this.token}`, ...(value === undefined ? {} : { 'Content-Type': 'application/json' }) },
      ...(value === undefined ? {} : { body: JSON.stringify(value) }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(`Registry ${response.status}: ${result.error ?? 'request failed'}`);
    return result;
  }
}
