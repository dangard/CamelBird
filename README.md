# CamelBird

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build` to build the project for production (DreamHost deploy). The build artifacts will be stored in the `dist/CamelBird/` directory and call **`https://api.camelbird.com`**.

For local Apache hosting on `*.camelbird.local`, use:

```bash
npm run build:local
```

This generates the development environment (API URL from `.env.development`, typically **`https://api.camelbird.local`**) and outputs an unoptimized bundle to `dist/CamelBird/`. Copy that folder to your local Apache docroot and hard-refresh the browser.

| Command | SPA origin | API target |
|---------|------------|------------|
| `npm start` | `http://localhost:4200` | `.env.development` → local API |
| `npm run build:local` | local Apache / `*.camelbird.local` | `.env.development` → local API |
| `npm run build` | `https://www.camelbird.com` | `https://api.camelbird.com` |

Copy **`.env.example`** → **`.env`** and optionally **`.env.development`** to set **`API_URL`**. See `docs/ARCHITECTURE.md` for details.

Admin entry: footer gear icon → `/admin/login` (requires CamelBird-API JWT auth).

### Local test admin

After running CamelBird-API migration [`001_auth_rbac.sql`](../api.camelbird.com/database/migrations/001_auth_rbac.sql) and seed [`dev_admin_user.sql`](../api.camelbird.com/database/seeds/dev_admin_user.sql):

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `changeme` |

Login at `http://localhost:4200/admin/login` (or your local Apache host). Change this password before any shared or production deployment.

Apply the seed (adjust DB credentials to match your `.env`):

```bash
mysql -u USER -p camelbird_db < ../api.camelbird.com/database/seeds/dev_admin_user.sql
```


## Running unit tests

Run `npm test` to execute the unit tests via [Jest](https://jestjs.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
