# CoSeeker — website

A static, black-and-white marketing site for CoSeeker. No build step, no dependencies to install — every page is plain HTML that can be served by any static host (Netlify, Vercel, GitHub Pages, S3/CloudFront, Nginx, etc.).

## Deployment

Live at **<https://www.coseeker.org>** as a **Coolify git app** (project `K4M2A`, uuid
`y74pgda298n48dfgn3twpv7h`). Push to `main` and Coolify rebuilds — no manual step, nothing to
copy to a server.

```bash
git push origin main
```

Despite having no build step, it ships as a **Docker image rather than a static buildpack**:
[`Dockerfile`](Dockerfile) puts the files behind `caddy:2-alpine` with a
[`Caddyfile`](Caddyfile) that does `try_files {path} {path}.html`. That is what preserves the
**extensionless URLs** (`/terms` → `terms.html`) the old apex Caddy used to provide — a plain
static host would 404 them. The Caddyfile also 404s `/Caddyfile`, `/Dockerfile` and
`/.dockerignore`, which otherwise ride along in the image and would be served.

The apex `coseeker.org` does not serve this site; it 301s the known site paths to `www`. Adding
a new page therefore needs its path added to the `@site` matcher in the **PDS** Caddyfile too,
or the apex URL for it falls through to the PDS and 404s — see the root
[`README.md`](../README.md) §5.

> Branch protection requires a PR; direct pushes to `main` are rejected.

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
In production this site and those routes both live on **Coolify** at `www.coseeker.org`, where
Traefik path-routes `/api/*` to the `forms-server` service, which emails the submission out.
(The apex `coseeker.org` only 301s these paths to `www`.) See the root
[`README.md`](../README.md) §6a for the backend and §5 for the apex redirects. When serving
this folder standalone (e.g. `npx serve .`) those endpoints won't exist, so submissions
will show a "Something went wrong" error — that's expected outside the real deployment.

> Coolify **strips the `/api` prefix** when path-routing, so forms-server matches either
> `/api/contact` or `/contact`. Keep both routes.

## Notes

- External links: "I have an invite" / "Enter CoSeeker" → `https://coseeker.app/`; open source → `https://github.com/k4m2a`.
- Contact email used across the site: `contact@coseeker.org`.
- Legal/help copy mirrors the canonical text on coseeker.org (effective 10 June 2026).

© 2026 K4M2A Foundation
