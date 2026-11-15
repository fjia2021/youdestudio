# Youde Studio website

Static bilingual (EN/DE) site for `youdestudio.com`. Plain HTML/CSS/JS, no build step, no cookies, no third-party requests.

## Structure

| URL | File |
|---|---|
| `/` | `index.html` (language chooser, redirects by browser language) |
| `/en/`, `/de/` | studio entry pages (a card per section; add the next section here) |
| `/en/fj/`, `/de/fj/` | Feng Jia: simulation + digital analytics |
| `/en/impressum/`, `/de/impressum/` | legal notice |
| `/en/privacy/`, `/de/datenschutz/` | privacy policy |
| `/{lang}/hm/` | reserved for a future second section |

Everything that is published lives in `public/` (`index.html`, `en/`, `de/`, `assets/`, `sitemap.xml`, `robots.txt`, `404.html`, `_headers`). `wrangler.jsonc` and this README are not published. The email address is assembled in `public/assets/site.js` so it is not in the HTML source.

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
4. After the first deploy: Worker > Settings > Domains & Routes > Add > Custom domain > `youdestudio.com`. Cloudflare creates the DNS record and HTTPS certificate automatically. Optionally add `www.youdestudio.com` too.
5. Every push to `main` redeploys the site. `public/_headers` sets basic security headers.

If an old DNS record from a previous GitHub Pages setup exists (A records to 185.199.x.x or a `www` CNAME to github.io), delete it before adding the custom domain.

## Email: Cloudflare Email Routing

Email > Email Routing: enable it, add a destination address (your private mailbox, verify it), then create the rule
`feng.jia@youdestudio.com` -> destination. Cloudflare adds the required MX/SPF records.

## Adding a new section later (e.g. `hm`)

Copy `en/fj/` and `de/fj/` to `en/hm/` and `de/hm/`, adapt the content, add a card on `en/index.html` and `de/index.html`, and list the URLs in `sitemap.xml`.
