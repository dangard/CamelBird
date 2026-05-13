# Apache hosting for CamelBird

This SPA ships **`src/.htaccess`** into the production root (`angular.json` assets). That file is the **canonical baseline** for deploy:

- Redirect HTTP → HTTPS (`www.camelbird.com`).
- Serve existing files/directories as static assets.
- Fallback unknown paths to **`/index.html`** for Angular routing.

Many hosts also apply **`<VirtualHost>`** directives outside `.htaccess`. Use this doc as a checklist when configuring TLS, caching, or security headers at the server level.

## Virtual host skeleton (HTTPS)

Prefer TLS certificates managed by your host (Let’s Encrypt, ACM, etc.). Example structure only — paths and modules vary by distro:

```apache
<VirtualHost *:443>
    ServerName www.camelbird.com
    DocumentRoot /var/www/camelbird/dist/CamelBird

    SSLEngine on
    SSLCertificateFile /path/to/fullchain.pem
    SSLCertificateKeyFile /path/to/privkey.pem

    # SPA bundle + index fallback — mirror rules from src/.htaccess if not relying on .htaccess alone
    <Directory "/var/www/camelbird/dist/CamelBird">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>

<VirtualHost *:80>
    ServerName www.camelbird.com
    Redirect permanent / https://www.camelbird.com/
</VirtualHost>
```

Adjust **`DocumentRoot`** to match where your CI/deploy drops **`index.html`** and hashed bundles (see **`ARCHITECTURE.md`** → build artifacts).

## Optional security headers

Ship these from **Apache** (or a CDN / reverse proxy) when policy allows. Tune CSP against real asset origins (`api.camelbird.com`, fonts, etc.).

### HTTP Strict Transport Security (HSTS)

```apache
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
```

Enable **`mod_headers`**. Verify preload eligibility separately before submitting to browser preload lists.

### Content-Security-Policy (starting point)

The app loads scripts/styles from **same origin** and uses **`withFetch()`** for API calls. Start restrictive and widen only as needed:

```apache
Header set Content-Security-Policy "\
default-src 'self'; \
script-src 'self'; \
style-src 'self'; \
img-src 'self' data: https:; \
font-src 'self'; \
connect-src 'self' https://api.camelbird.com; \
base-uri 'self'; \
frame-ancestors 'none'"
```

**Important:**

- **Bootstrap Icons / fonts**: Icons/fonts ship from **`node_modules`** into the bundle (`angular.json` styles); **`font-src 'self'`** is usually sufficient unless you add external CDNs.
- **Google Fonts / analytics**: Add explicit origins if introduced later.
- Test with browser devtools CSP reporting before enforcing in production.

### Other headers (often useful)

```apache
Header set X-Content-Type-Options "nosniff"
Header set Referrer-Policy "strict-origin-when-cross-origin"
Header set Permissions-Policy "geolocation=(), microphone=(), camera=()"
```

## Coordination with `.htaccess`

- **Duplicate logic**: Avoid conflicting rewrite rules in both vhost and `.htaccess`; prefer one clear owner.
- **Headers**: `.htaccess` in-repo intentionally stays minimal (rewrites only). Prefer **`Header`** directives in **SSL vhost** or a managed edge config so CSP/HSTS stay reviewable in one place.

## References

- `docs/ARCHITECTURE.md` — build output layout and SPA fallback behavior.
- `src/.htaccess` — repository-truth rewrite rules copied into builds.
