# Boondock Labs Portfolio

A modern, creative portfolio and tech studio site for Eugene Boondock, built with Next.js 15, Tailwind CSS, and React. Showcases web apps, games, digital worlds, and AI-powered features.

## Features
- Animated glassmorphism UI with custom background
- Responsive design for mobile and desktop
- Interactive chat with AI avatar (OpenAI API)
- Contact and inquiry forms
- Animated particle background
- Social media links and branding
- Modern font (Rubik via next/font/google)

## Tech Stack
- [Next.js 15 (App Router)](https://nextjs.org/)
- [React 18](https://react.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [Lucide React Icons](https://lucide.dev/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [OpenAI API](https://platform.openai.com/)

## Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/EugeneBoondock/Boondock_Labs.git
   cd Boondock_Labs/boondock-labs
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your API keys and endpoints.
4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the site.

## Deployment

The site runs as a Cloudflare Worker using OpenNext. The Worker configuration is in `wrangler.jsonc`. The `OUTREACH_DB` binding points to the existing `boondock-labs-outreach` D1 database. Apply new D1 migrations separately before deploying code that needs them.

```bash
npm ci
npm run build:cloudflare
npx wrangler deploy
```

The production Worker requires the `OPENAI_API_KEY` secret for `/api/chat`. Set it through Wrangler’s hidden prompt. The admin routes require Cloudflare Access for `/admin` and `/api/admin/*`, plus `CF_ACCESS_TEAM_DOMAIN` and `CF_ACCESS_AUD` Worker settings. They deny access when those settings are absent. The public contact form uses `NEXT_PUBLIC_FORMSPREE_ENDPOINT` at build time. Keep local environment files out of Git.

See [the migration record](CLOUDFLARE_MIGRATION.md) for DNS, hosting identifiers, and rollback steps.

## Customization
- **Fonts:** Uses Rubik via `next/font/google` for a modern look.
- **Theme:** Easily customizable via Tailwind and CSS variables in `globals.css`.
- **AI Chat:** Configure `OPENAI_API_KEY` for the Worker.

## License
MIT

---

Made with ❤️ by Eugene Boondock
