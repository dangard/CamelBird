# Deploying to DreamHost

This site is a static Angular SPA. Production builds land in **`dist/CamelBird/`** and are uploaded to DreamHost shared hosting over **SFTP** using an **SSH key** (via Node.js — no `rsync` required).

## Quick start

```bash
cp .env.deploy.example .env.deploy
# Edit .env.deploy with your DreamHost SSH host, user, document root, and key path

npm run deploy:dry-run   # preview what would upload/delete
npm run deploy           # build + sync
```

## npm scripts

| Script | Description |
|--------|-------------|
| `npm run deploy` | Production build, then SFTP upload to DreamHost |
| `npm run deploy:sync` | Upload only (`dist/CamelBird/` must already exist) |
| `npm run deploy:dry-run` | Build and preview planned uploads/deletes without changing the server |

Config lives in **`.env.deploy`** (gitignored). See **`.env.deploy.example`** for required variables.

## DreamHost one-time setup

1. **Enable shell access** — DreamHost panel → **Users** → **Manage Users** → enable shell for the deploy user.
2. **Confirm SSH hostname and user** — note the **SSH hostname** (usually `psXXXX.dreamhost.com` or `iad1-shared-….dreamhost.com`) and **username**. Use those for `DEPLOY_HOST` and `DEPLOY_USER`.
3. **Confirm document root** — **Websites** → **Manage Websites** → your domain. Typical path: `/home/USERNAME/www.camelbird.com`. The `USERNAME` must match `DEPLOY_USER`.
4. **Authorize an SSH key** — generate a deploy key locally if needed:
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/dreamhost_ed25519
   ```
   Add the public key to the server (panel SSH keys if available, or manually after one password login):
   ```bash
   ssh USER@HOST
   mkdir -p ~/.ssh && chmod 700 ~/.ssh
   echo "YOUR_PUBLIC_KEY" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```
   Set **`DEPLOY_SSH_KEY`** in `.env.deploy` to the private key path.
5. **Test SSH**:
   ```bash
   ssh -i C:/Users/Daniel/.ssh/dreamhost_ed25519 -p 22 YOUR_USER@YOUR_HOST
   ```
6. **First deploy** — always run `npm run deploy:dry-run` and confirm the file list includes `index.html`, hashed `*.js` / `*.css`, and `.htaccess`.

## What gets synced

The script uploads the **contents** of `dist/CamelBird/` into the remote document root. After upload, it removes remote files that are no longer in the build (stale hashed JS/CSS bundles from prior Angular builds).

Apache rewrite rules ship via **`src/.htaccess`**, copied into the build by `angular.json`. After deploy, verify deep links (e.g. `/devblog`) resolve to `index.html` for client-side routing.

## Windows

Deploy runs from **PowerShell**, **Git Bash**, or **WSL** — only Node.js and SSH access to DreamHost are required.

## Verification

After a live deploy:

1. Open `https://www.camelbird.com` and hard-refresh.
2. Navigate directly to a route such as `/devblog` — should load without a 404.
3. Confirm HTTPS redirect works (HTTP → `https://www.camelbird.com`).

## Related docs

- [`docs/APACHE_CONFIG.md`](APACHE_CONFIG.md) — vhost headers and `.htaccess` coordination
- [`docs/ARCHITECTURE.md`](ARCHITECTURE.md) — build output layout and hosting model
