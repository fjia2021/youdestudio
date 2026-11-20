# Youde Studio website

Static bilingual (EN/DE) site for `youdestudio.com`. Plain HTML/CSS/JS, no build step. No cookies or third-party requests until the visitor consents (Klaro + Google Tag Manager, see below). A small Cloudflare Worker (`src/worker.js`) handles the contact form.

## Structure

| URL | File |
|---|---|
| `/` | German studio entry page (default language) |
| `/en/` | English studio entry page |
| `/fj/`, `/en/fj/` | Feng Jia: simulation + digital analytics |
| `/impressum/`, `/en/impressum/` | legal notice |
| `/en/privacy/`, `/datenschutz/` | privacy policy |
| `/hm/`, `/en/hm/` | reserved for a future second section |

Everything that is published lives in `public/` (`index.html`, `en/`, the German root-level pages, `assets/`, `sitemap.xml`, `robots.txt`, `404.html`, `_headers`, `_redirects`). `wrangler.jsonc` and this README are not published. The email address is assembled in `public/assets/site.js` so it is not in the HTML source.

The former `/de/*` URLs permanently redirect to their German root-level equivalents.

## Before going live

1. The Impressum pages currently show only "Freiburg im Breisgau" as the address. Before going live commercially, replace it with a serviceable postal address (street, number, postcode); a virtual office, coworking or c/o address avoids publishing a home address (no P.O. box).
2. Have the German texts proofread by a native speaker.

## Local preview

```powershell
python -m http.server 8080 --directory public
```
Open http://localhost:8080/ (root-relative links require serving from the site root).

## Deploy: Cloudflare (Workers static assets)

`wrangler.jsonc` publishes the `public/` folder.

1. Push this folder to the `main` branch of the GitHub repository (it can be private).
2. Cloudflare dashboard > Workers & Pages > Create application > connect the GitHub repository.
3. Project/Worker name `youdestudio` (must match `name` in `wrangler.jsonc`). Build command: empty. Deploy command: `npx wrangler deploy`.
4. The custom domains `youdestudio.com` and `www.youdestudio.com` are declared in `wrangler.jsonc` (`routes`), so the first successful deploy creates the DNS records and HTTPS certificates automatically. This only works if no conflicting DNS record (for example an old A or CNAME record) exists for those hostnames.
5. Every push to `main` redeploys the site. `public/_headers` sets basic security headers.

If an old DNS record from a previous GitHub Pages setup exists (A records to 185.199.x.x or a `www` CNAME to github.io), delete it before adding the custom domain.

## Email: Cloudflare Email Routing

Email > Email Routing: enable it, add a destination address (your private mailbox, verify it), then create the rule
`feng.jia@youdestudio.com` -> destination. Cloudflare adds the required MX/SPF records.

## Contact form (Cloudflare Worker + Email Routing)

The form on the Impressum pages posts to `/api/contact`, handled by `src/worker.js`; all other requests are served directly from `public/` (`run_worker_first: ["/api/*"]`). The Worker validates the input (honeypot field, length limits, same-origin check) and sends the message with the `send_email` binding `CONTACT_MAIL`.

One-time setup:
1. Email Routing must be enabled for `youdestudio.com` (see below) and your private mailbox must be a **verified destination address**.
2. Store that mailbox as a secret (not in git): `npx wrangler secret put CONTACT_TO` (or Workers & Pages > youdestudio > Settings > Variables and Secrets).
3. Deploy (`npx wrangler deploy` or push to `main`).

Local test: create `.dev.vars` with `CONTACT_TO=you@example.com` and `ALLOW_ANY_ORIGIN=1`, run `npx wrangler dev`, open http://localhost:8787/impressum/ (the email is written to a local file instead of being sent).

Optional hardening against spam: add a Cloudflare WAF rate-limiting rule for `/api/contact`, or Cloudflare Turnstile (this would need a Turnstile entry in the privacy policy).

## Consent (Klaro) and Google Tag Manager

- `public/assets/klaro/` holds a self-hosted copy of Klaro 0.7.21 (BSD-3, see `LICENSE.txt`); nothing is loaded from third parties before consent.
- `public/assets/consent.js` (loaded synchronously in `<head>` before Klaro) sets Consent Mode v2 defaults to `denied`, holds the Klaro config and loads GTM through the Stape custom loader (`https://youdestudio.com/fx/iqshbzzfg.js`) only after at least one category is accepted (Consent Mode "basic": consent signals are always sent before GTM loads, so there are no Google pings without consent). To change the container, edit `GTM_SRC` / `GTM_ID` there.
- Two Klaro services map to the Consent Mode signals: `gtmAnalytics` -> `analytics_storage`; `gtmAds` -> `ad_storage`, `ad_user_data`, `ad_personalization`.
- Every page except `404.html` includes the three tags (stylesheet, `consent.js`, `klaro.js`) and a footer button `[data-consent-settings]` that reopens the dialog. Add the same to any new page.
- `site.js` pushes `contact_form_submit` (form sent) and `contact_email_click` (mail link) to `dataLayer`, only when GTM is loaded. Use them as GTM triggers (Custom Event) for Google Ads conversions.
- In GTM, set the Google Ads / GA4 tags to require `ad_storage` / `analytics_storage` (built-in consent checks) and test with Tag Assistant in both consent states.
- The `<noscript>` GTM iframe is intentionally not used (it cannot respect consent).
- If you add tags that set other cookies, add them to the matching service in `consent.js` (`cookies`) and to the privacy policy.

## Adding a new section later (e.g. `hm`)

Copy `en/fj/` to `en/hm/` and `fj/` to `hm/`, adapt the content, add a card on `en/index.html` and `index.html`, and list the URLs in `sitemap.xml`.
