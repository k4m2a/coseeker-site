# The site is plain static HTML — no build step. Caddy serves it and handles the
# extensionless URLs (/terms -> terms.html) the old apex Caddy used to provide.
FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY . /srv

EXPOSE 80
