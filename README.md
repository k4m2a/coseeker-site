# CoSeeker — website

A static, black-and-white marketing site for CoSeeker. No build step, no dependencies to install — every page is plain HTML that can be served by any static host (Netlify, Vercel, GitHub Pages, S3/CloudFront, Nginx, etc.).

## Run locally

Just serve the folder root with any static server, e.g.:

```
npx serve .
# or
python3 -m http.server
```

Then open `http://localhost:3000` (or the port shown). Opening `index.html` directly via `file://` also works.

## Pages

| File                 | Purpose                                        |
|----------------------|------------------------------------------------|
| `index.html`         | Home                                           |
| `manifesto.html`     | Manifesto (blog-style)                         |
| `faq.html`           | Frequently asked questions (accordion)         |
| `contact.html`       | Contact details + message form                 |
| `request-invite.html`| Invite request form                            |
| `guidelines.html`    | Community Guidelines                           |
| `privacy.html`       | Privacy Policy                                 |
| `terms.html`         | Terms of Service                               |
| `help.html`          | Help / support                                 |

## Shared files

- `site.css` — the design system (colors, typography, header, footer, forms, doc pages). All pages except the home use it.
- `site.js` — small vanilla-JS helpers: mobile menu, FAQ accordion, and client-side form validation/confirmation.
- `support.js` — runtime used **only by `index.html`** (the home is a self-rendering component page). Keep it alongside `index.html`.
- `assets/` — `coseeker-earth.svg` (logo mark) and `favicon.png`.

Fonts (Bricolage Grotesque + DM Sans) load from Google Fonts via `<link>` — no local font files.

## Forms

`request-invite.html` and `contact.html` validate client-side (`site.js`), then POST JSON
to the endpoint in each form's `data-endpoint` attribute (`/api/contact`, `/api/invite`).
In production those routes are proxied by Caddy to a self-hosted Node service
(`forms-server/` at the repo root) that emails the submission out — see the root
[`README.md`](../README.md) §6a for the backend and §5 for the Caddy routing. When serving
this folder standalone (e.g. `npx serve .`) those endpoints won't exist, so submissions
will show a "Something went wrong" error — that's expected outside the real deployment.

## Notes

- External links: "I have an invite" / "Enter CoSeeker" → `https://coseeker.app/`; open source → `https://github.com/k4m2a`.
- Contact email used across the site: `contact@coseeker.org`.
- Legal/help copy mirrors the canonical text on coseeker.org (effective 10 June 2026).

© 2026 K4M2A Foundation
