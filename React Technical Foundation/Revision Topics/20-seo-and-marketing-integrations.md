## SEO & Marketing Integrations

- [ ] Meta tags, structured data (JSON-LD), Open Graph/Twitter cards
- [ ] Sitemaps and robots; Next.js metadata API
- [ ] Analytics: consent, privacy, script loading impact
- [ ] Localization/internationalization: i18n libraries, routing, number/date

---

### Metadata and rich previews
Set canonical URLs, titles, and descriptions per route. Provide Open Graph/Twitter meta for rich link previews. Use JSON-LD for structured data (articles, products, breadcrumbs) to enhance search features.

---

### Crawling and sitemaps
Generate sitemaps and ensure robots directives are correct per environment. Avoid blocking important assets (CSS/JS) needed for rendering.

---

### Analytics with care
Load analytics scripts after critical rendering. Respect user consent (CMP) and privacy settings. Avoid synchronous third-party scripts that block the main thread; prefer async/defer and server-side tag management when possible.

---

### Internationalization
Use i18n libraries (react-intl, i18next) and locale-aware routing. Handle number/date formatting via Intl APIs. Provide `hreflang` tags for alternate language routes.


