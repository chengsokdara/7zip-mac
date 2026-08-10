# SEO runbook: rank for "7zip for mac"

Living checklist for the 7zip-mac project site
(`https://chengsokdara.github.io/7zip-mac/`).
Keep this file at the repo root (not under `docs/`) so it is not published as a site page.

## Goal

Top organic visibility for:

- `7zip for mac` / `7-zip for mac` (head)
- `open 7z on mac`, `extract 7z macOS`, `install 7zip mac` (long-tail)

Realistic 6–12 month target: **top 3–5** on head terms where possible;
**#1** on product-fit long-tails. Official 7-zip.org will often win pure brand download intent.

## Site map (content cluster)

| URL | Intent |
|-----|--------|
| `/` | Product hub + install |
| `/open-7z-on-mac/` | How-to open/extract |
| `/install-7zip-mac/` | Install intent |
| `/finder-services-7zip/` | Right-click / Services |
| `/7zip-vs-keka/` | Comparison |
| `/7zip-vs-the-unarchiver/` | Comparison |
| `/uninstall/` | Support |
| `/faq/` | FAQ / snippets |
| `/guides/` | Index |

Regenerate guide HTML after editing `docs/build-pages.mjs`:

```bash
node docs/build-pages.mjs
```

## Phase 1 — You must do in the browser (measurement)

### Google Search Console

1. Open [Google Search Console](https://search.google.com/search-console).
2. Add URL-prefix property: `https://chengsokdara.github.io/7zip-mac/`
3. Verify (HTML file upload into `docs/` or DNS if you later use a custom domain).
4. Sitemaps → submit: `https://chengsokdara.github.io/7zip-mac/sitemap.xml`
5. URL inspection → request indexing for `/` and top guides.

### Bing Webmaster Tools

1. Import from GSC or add the same site.
2. Submit the same sitemap.

### Baseline ranks (weekly)

Record position (incognito / rank tool) for:

- 7zip for mac
- 7-zip for mac
- open 7z on mac
- extract 7z mac
- install 7zip mac
- 7zip vs keka

## Phase 2 — Technical

- [x] Title, description, canonical, OG, Twitter
- [x] JSON-LD SoftwareApplication + FAQ + HowTo
- [x] robots.txt + sitemap
- [x] Multi-page content cluster
- [ ] Custom domain (optional high leverage)
- [ ] Analytics (Plausible / Umami / GA4 / Cloudflare)

### Custom domain checklist

1. Buy domain (e.g. keyword-aligned brand).
2. GitHub repo → Settings → Pages → Custom domain + Enforce HTTPS.
3. Update `site-config.js` `siteUrl`, all canonicals, OG URLs, schema, sitemap base in `build-pages.mjs`, README install notes.
4. Keep `chengsokdara.github.io/7z` bootstrap working.

## Phase 3 — Off-page (distribution)

| Channel | Action |
|---------|--------|
| Show HN | “Finder Services for 7-Zip (7zz) on macOS” |
| Reddit | Answer r/MacOS / r/macapps “open 7z” threads helpfully |
| Ask Different / SO | Accurate `brew install sevenzip` + Finder wrapper when relevant |
| YouTube / X | 30s demo: open 7z on Mac |
| GitHub | Topics, stars, clear README |

### GitHub topics (suggested)

`7zip` `7z` `macos` `finder` `homebrew` `archiver` `shell` `p7zip` `sevenzip`

## Phase 4 — Monthly loop

1. GSC: impressions with low CTR → rewrite titles/descriptions.
2. Positions 8–20 → strengthen that page or add internal links.
3. New People Also Ask → expand FAQ.
4. Refresh comparison pages when competitors change pricing.

## Trust rules

- Never claim to be official 7-Zip / 7-zip.org.
- Keep the affiliation disclaimer on every page footer.
- Do not fake review stars in schema.
- Prefer reviewing `install.sh` before `curl | bash` in security-sensitive docs.

## Success metrics

| Horizon | Target |
|---------|--------|
| 90 days | ≥5 indexed URLs; GSC impressions; ≥1 quality referring domain |
| 6 months | Top 10 head term and/or top 3 how-to keyword |
| 12 months | Stable top 5 head **or** clear #1 on 2+ long-tails with install conversions |
