# LaunchKit

**From idea to investor-ready in about 10 minutes.**

LaunchKit turns a raw business idea — or a messy pile of notes, a README, a PDF — into a full suite of launch assets: brand identity, market analysis, business plan, financial projections, marketing strategy, pitch deck, and legal templates.

🚀 **Live demo:** https://or4cl3-ai-1.github.io/launchkit/

## How it works

1. **Describe your idea** — fill in a 5-step wizard, or import a PDF / paste a document and let the AI extract the details.
2. **Pick a brand vibe** — Minimal, Bold, Luxury, Tech, or Rebel. Every asset inherits it.
3. **Generate** — 8 asset categories generated in a few minutes, with live progress.
4. **Export & share** — Markdown, JSON, or a shareable link.

### What you get

- **Brand identity** — logo concepts, palette, typography
- **Market intelligence** — TAM/SAM/SOM, personas, demand signals
- **Competition analysis** — competitor profiles, pricing, SWOT positioning
- **Business plan** — ~15-page executive plan
- **Financial projections** — startup costs, break-even, P&L, CAC/LTV
- **Marketing strategy** — 30-day launch calendar, SEO keywords, ad copy
- **Pitch deck** — slides with speaker notes
- **Legal templates** — Privacy Policy, Terms of Service

## Bring your own key

LaunchKit has no server and no accounts. It calls an OpenAI-compatible chat API directly from your browser:

- Paste your API key once — it stays in your browser's local storage and is only ever sent to the provider you choose.
- Works with OpenAI or any OpenAI-compatible endpoint (custom base URL supported).
- No key, no generation — the app asks before doing anything billable.

## Honest limitations

- **AI-drafted, not final.** Every asset is a starting point. Review and edit before showing it to investors, customers, or lawyers.
- **Legal templates are templates, not legal advice.**
- **Market and financial figures are AI-generated estimates,** not verified data. Verify anything you put in front of money.
- Projects live in your browser's local storage (~5–10 MB). Export anything you care about.

## Run it locally

```bash
git clone https://github.com/or4cl3-ai-1/launchkit.git
cd launchkit
npm install --legacy-peer-deps
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
```

## Roadmap

- One-time asset packs (Starter $49 / Pro $99 / Complete $199 / Refresh $29) via Stripe Payment Links — app is wired, links pending (see STRIPE_SETUP.md)
- PDF export with branded templates
- Per-asset regeneration
- More brand vibes

## Tech

React 19 · TypeScript · Vite 7 · Tailwind CSS 4 · shadcn/ui · pdfjs-dist · Framer Motion

## License

MIT — see [LICENSE](LICENSE).
