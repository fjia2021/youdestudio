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

Shared assets are in `assets/`. The email address is assembled in `assets/site.js` so it is not in the HTML source.

## Before going live

1. The Impressum pages currently show only "Freiburg im Breisgau" as the address. Before going live commercially, replace it with a serviceable postal address (street, number, postcode); a virtual office, coworking or c/o address avoids publishing a home address (no P.O. box).
2. Have the German texts proofread by a native speaker.

## Local preview

```powershell
python -m http.server 8080
```
Open http://localhost:8080/ (root-relative links require serving from the site root).

## Deploy: GitHub Pages

1. Create a GitHub repository and push this folder to the `main` branch.
2. Repository Settings > Pages > Deploy from branch `main`, folder `/ (root)`. The `CNAME` file sets the custom domain `youdestudio.com`.
3. Enable "Enforce HTTPS" once the certificate is issued.

## DNS: Cloudflare

Add these records with proxy status **DNS only** (grey cloud) so GitHub can issue the certificate:

| Type | Name | Value |
|---|---|---|
| A | `@` | 185.199.108.153 |
| A | `@` | 185.199.109.153 |
| A | `@` | 185.199.110.153 |
| A | `@` | 185.199.111.153 |
| CNAME | `www` | `<github-username>.github.io` |

Check the current GitHub Pages IPs in GitHub's documentation before configuring.

## Email: Cloudflare Email Routing

Email > Email Routing: enable it, add a destination address (your private mailbox, verify it), then create the rule
`feng.jia@youdestudio.com` -> destination. Cloudflare adds the required MX/SPF records.

## Adding a new section later (e.g. `hm`)

Copy `en/fj/` and `de/fj/` to `en/hm/` and `de/hm/`, adapt the content, add a card on `en/index.html` and `de/index.html`, and list the URLs in `sitemap.xml`.
