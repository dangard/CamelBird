# Architecture: CamelBird

## Document control

- **Target scope**: `whole-repo` — workspace root `e:\Sites\www.camelbird.com`
- **Audience mode**: `architecture-review`
- **Out of scope**: `none`
- **Last reviewed**: 2026-05-13 — **Source**: live analysis (no git SHA captured)
- **Output**: `docs/ARCHITECTURE.md`

### Context from stakeholders

- **Deployment**: confirmed **Apache** (consistent with the in-repo `src/.htaccess`: HTTPS redirect from port 80, asset/dir passthrough, SPA fallback to `/index.html`).

## Executive summary

CamelBird is a small **Angular 20 standalone single-page application** for a personal site (accomplishments, interests, dev blog, branding). The build emits a static bundle to **`dist/CamelBird`** (application builder; browser assets at the project output root) and is served by **Apache** using a `.htaccess` that forces HTTPS and routes unknown paths back to `index.html` for client-side routing. The only dynamic feature is a **dev blog** that calls an external REST API (`environment.apiServerUrl` → `https://api.camelbird.com` in production) for list and create operations; that backend is not in this repository. The codebase is small (≈10 components, 2 services, route config in `app.routes.ts`, 1 constants class) with **Jest** unit tests and **GitHub Actions CI** (`lint`, production `build`, `test`). Remaining architectural watch items include: **a UI feature flag (`enableDevlogCreate`) used as a quasi-security boundary** (API must enforce auth), and **Sass `@import` / Bootstrap deprecation noise** (warnings only until upstream or `@use` migration).

## Context

External actors and systems:

```mermaid
flowchart LR
  user[End user web browser]
  apache[Apache static host: www.camelbird.com]
  api[api.camelbird.com REST API]

  user -->|HTTPS, route| apache
  apache -->|index.html + bundle| user
  user -.->|GET /devlogs, POST /devlog| api
```

- **End users** load the static SPA from Apache and interact entirely in the browser.
- **`api.camelbird.com`** is an external service owned outside this repo; only the dev blog feature talks to it.
- **No SSO, identity provider, CDN, or analytics** is observed in the repository.

## Goals and constraints

- **Goal (inferred from code/routes)**: present static personal-site content (`accomplishments`, `interests`, `camelbird`) plus a dynamic `devblog` view.
- **Build constraints (`angular.json`)**:
  - Production budgets: initial bundle warning **1mb** / error **1.25mb**; per-component-style warning 2kb / error 4kb.
  - **Strict mode enabled** at the Angular project level.
  - Production swaps `environment.ts` → `environment.prod.ts` (`fileReplacements`).
- **Hosting constraint**: Apache with `.htaccess`; rewrites assume a single-page fallback to `index.html`.
- **No explicit non-functional requirements** documented in repo.

## High-level architecture

Standalone bootstrap, application routes, one feature service. Two distinct slices: static pages (no I/O) and the dev blog (HTTP + intra-app pub/sub).

```mermaid
flowchart TB
  subgraph spa [Browser: CamelBird SPA]
    direction TB
    bootstrap[main.ts bootstrapApplication AppComponent]
    router[provideRouter app.routes]
    subgraph pages [Pages]
      acc[AccomplishmentsComponent]
      inter[InterestsComponent]
      cb[CamelbirdComponent]
      blog[DevblogComponent]
    end
    subgraph shared [Shared components]
      header[HeaderComponent]
      footer[FooterComponent]
      list[DevblogListComponent]
      creator[DevblogCreatorComponent]
      face[FaceOffCritiqueComponent]
    end
    subgraph svcs [Services]
      devsvc[DevblogService]
      evtsvc[EventListenerService]
      constants[AppConstants]
    end
    env[environment.ts / environment.prod.ts]
    bootstrap --> router
    router --> pages
    pages --> shared
    list --> devsvc
    creator --> devsvc
    devsvc --> evtsvc
    list --> evtsvc
    devsvc --> constants
    devsvc --> env
    header --> env
    blog --> env
  end

  apache[Apache: www.camelbird.com]
  api[api.camelbird.com]
  devsvc -->|HttpClient: GET /devlogs, POST /devlog| api
  apache -->|serves bundle + index.html fallback| spa
```

Critical-path sequence (load + create dev log):

```mermaid
sequenceDiagram
  participant U as User
  participant A as Apache
  participant SPA as CamelBird SPA
  participant L as DevblogListComponent
  participant S as DevblogService
  participant E as EventListenerService
  participant API as api.camelbird.com

  U->>A: GET /devblog
  A-->>U: index.html + JS bundle
  U->>SPA: Router activates /devblog
  SPA->>L: ngOnInit
  L->>S: getDevBlogs()
  S->>API: GET /devlogs
  API-->>S: list of devlogs
  S-->>L: Observable response
  Note over L: render list

  U->>SPA: submit create form
  SPA->>S: createDevBlog({title, body, user})
  S->>API: POST /devlog
  API-->>S: { log_id }
  S->>E: sendUpdate("DEVLOG_CREATED")
  E-->>L: event observed
  L->>S: getDevBlogs() (refresh)
```

## Components / services

### Routing and shell

- **`main.ts`** calls `bootstrapApplication(AppComponent, …)` with `provideRouter(routes)`, `provideHttpClient(withFetch())`.
- **`app.routes.ts`** declares 4 routes plus a default redirect:
  - `''` → redirect `/accomplishments`
  - `accomplishments`, `interests`, `devblog`, `camelbird`
- **Routed/feature components** are **`standalone: true`**; there is no `AppModule`.
- **`AppComponent`** holds layout (header + `RouterOutlet` + footer); footer year computed from `new Date()`.
- **`HeaderComponent`** reads `environment.enableDevBlog` to decide whether the dev blog nav link is shown.
- **`FooterComponent`** — presentational.

### Pages

- **`AccomplishmentsComponent`, `InterestsComponent`, `CamelbirdComponent`** — static content, no inputs or services.
- **`DevblogComponent`** — wraps the dev blog feature; reads `environment.enableDevlogCreate` to enable/disable the creator UI.

### Dev blog feature

- **`DevblogListComponent`** — lists posts, subscribes to `EventListenerService` to refresh on `DEVLOG_CREATED`, formats dates via **date-fns**, owns local `loading` and `errorMessage` state (`takeUntilDestroyed` for subscriptions).
- **`DevblogCreatorComponent`** — `ReactiveForms` form (`title`, `body` required); hard-codes `user = "dangard"`; POSTs via `DevblogService`.
- **`DevblogService`** (`providedIn: 'root'`) — single HTTP gateway for the feature.
  - **Signatures**: typed payloads via `src/app/shared/models/devblog-api.types.ts` — e.g. `getDevBlogs(): Observable<DevBlogListPayload[]>`, `createDevBlog` → `post<CreateDevBlogResponse>`.
  - **Dependencies**: `HttpClient`, `AppConstants`, `EventListenerService`, `environment`.
  - **API contract observed**:
    - `GET {apiServerUrl}/devlogs` → list
    - `POST {apiServerUrl}/devlog` → `{ log_id }`
- **`EventListenerService`** — in-app pub/sub via RxJS `Subject<any>` (`sendUpdate`, `getUpdate`). One topic, untyped payload (`{ text: string }`).
- **`AppConstants`** — central place for API paths and event names; injectable; no values from env.

### Other shared components

- **`FaceOffCritiqueComponent`** — local random-string generator from a hard-coded adjectives list; **no HTTP, no shared state**; effectively a leaf utility component (likely used by a page template; not reachable from a route directly).

### Models

- **`Devblog`** model: simple class with `title`, `body`, `user`, plus `convertToJson()`. No `id` field (`TODO` in code).

## Data architecture

- **Client-side**: No local persistence (no `localStorage`, no NgRx, no service-worker cache). All dev-blog data is fetched per page load via `HttpClient`.
- **Server-side**: Owned by the **external** `api.camelbird.com`; schema and retention not visible in this repository.
- **PII**: The only user-identifying value in the client is the hard-coded string `"dangard"` passed as `user` when creating a dev log. Anything else PII-related would live server-side.

## Security and trust

- **Authentication / authorization**: No Angular **route guards**, **HTTP interceptors**, **JWT/cookie handling**, or **OAuth flow** observed. Requests to `api.camelbird.com` are issued **unauthenticated** from this codebase.
- **Feature flag misuse risk**: `environment.enableDevlogCreate` (`false` in prod) only hides the creator UI; the **API endpoint is still reachable** from a browser. True authorization must be enforced by the API.
- **Transport**:
  - Production API URL is HTTPS.
  - `.htaccess` forces HTTPS on the site itself (`SERVER_PORT 80 → https://www.camelbird.com/`).
- **Secrets**: None checked into source (only the public API hostname).
- **Content security**: No CSP, SRI, or security headers configured in repo (would be set in Apache config or `.htaccess` — neither present beyond the rewrite block).
- **Third-party JS**: **No** global `jquery` / Bootstrap JS in `angular.json`; styling uses **Bootstrap SCSS** from `src/styles.scss`.

## Operations and reliability

- **Hosting**: Apache static hosting; `src/.htaccess` is copied into the build via the `assets` array in `angular.json` and provides:
  - HTTPS canonicalization.
  - Pass-through for existing files/dirs.
  - SPA fallback (`RewriteRule ^ /index.html`).
- **Build artifacts**: `dist/CamelBird` (production, with `outputHashing: "all"`; application builder with `outputPath.browser` empty so static files land at this root — same deploy path as before the `browser/` subfolder default).
- **Environments**: only `development` and `production` configurations; no staging configuration in `angular.json`.
- **Health checks, observability, SLOs**: **Not observed in repository.**
- **Error handling**: `DevblogService.createDevBlog` logs to `console.error` on failure and stores `error.message` in a field that is not surfaced to the user. List load mirrors the same pattern.

## Development workflow

- **Run locally**: `npm start` → `ng serve` on `http://localhost:4200/`; dev env points API to `http://localhost`.
- **Build**: `npm run build` → `ng build` (production by default per `defaultConfiguration: "production"`).
- **Watch**: `npm run watch` → `ng build --watch --configuration development`.
- **Lint**: `npm run lint` → `tsc --noEmit && eslint . --ext js,ts,json,html --quiet --fix` (config: `.eslintrc.json` with `@angular-eslint/recommended`).
- **Test**: `npm test` → **`jest --ci --runInBand`** (`jest.config.cjs`, `setup-jest.ts` with zone test env from `jest-preset-angular`).
- **Tests present**: spec files exist for every component and both services (`*.component.spec.ts`, `*.service.spec.ts`).
- **CI**: `.github/workflows/ci.yml` — Node 20, `npm ci`, lint, production build, Jest (no browser install).
- **IaC**: **None** (no Terraform, Pulumi, Bicep, CloudFormation, K8s manifests).
- **Local-dev tooling**: ESLint + Prettier + TypeScript strict; `.editorconfig`, `.nvmrc` (Node 20), `.gitattributes` (line endings).

## Risks, gaps, and recommendations

Listed roughly by impact for an architecture review.

| # | Issue | Evidence | Recommendation | Trade-off |
|---|-------|----------|----------------|-----------|
| 1 | ~~**EOL Angular toolchain**~~ | *Addressed*: Angular **20**, TypeScript **5.8**, application builder | Stay on supported majors; rerun `ng update` on cadence. | Ongoing upkeep. |
| 2 | ~~**No CI**~~ | *Addressed*: `.github/workflows/ci.yml` | Extend with deploy preview or bundle-size reporting if desired. | More YAML to maintain. |
| 3 | ~~**Untyped HTTP**~~ | *Improved*: `devblog-api.types.ts` + typed `DevblogService` methods | Extend types if API grows; optionally generate from OpenAPI. | Schema/source of truth outside repo. |
| 4 | **Feature flag treated as a control** | `environment.enableDevlogCreate` only hides the creator UI; service still exposes `createDevBlog` | Enforce authorization on `api.camelbird.com`. Keep flag as UX-only; document it is **not** a security boundary. | Server-side effort. |
| 5 | ~~**jQuery + Bootstrap JS**~~ | *Removed* from `angular.json` scripts | N/A unless new global scripts are added. | — |
| 6 | ~~**Monolithic NgModule**~~ | *Addressed*: standalone components + `app.routes.ts` | Optional: lazy routes per feature if bundle grows. | Slight routing churn. |
| 7 | **`EventListenerService` is a string-based bus** | `Subject<any>` with `{ text: message }` payload and string constants in `AppConstants.EVENTS` | Replace with a typed discriminated union or a dedicated refresh observable. | Slightly more coupling if collapsed into one service. |
| 8 | **No observability** | No logger abstraction, no client-side error reporting, no analytics | Add `LoggerService` + optional `HttpInterceptor` for centralized errors / reporting later. | New deps if wired to a vendor. |
| 9 | **Error surfacing is thin** | `console.error`; limited user-visible errors | Toasts or inline errors on list/create failure. | Small UI work. |
| 10 | **Apache config split** | `src/.htaccess` rewrites/HTTPS only; security headers may live in vhost | Document canonical Apache config; add CSP/HSTS if policy allows. | Host must permit overrides. |
| 11 | **Sass deprecations** | Build warnings: `@import`, Bootstrap internal APIs | Migrate app SCSS to `@use`; upgrade Bootstrap when compatible. | Mechanical + upstream timing. |

### Optional target-state placeholder

Suggested next increments:

- Lazy-loaded routes per feature if initial bundle grows; **error reporting** + minimal **CSP**; complete **observability** story; Sass **`@use`** migration.

## Open questions

- **`api.camelbird.com`** — Where is its source, what auth does it require, and who owns it? The behavior here assumes it is open or network-restricted.
- **Apache config** — Is there a managed Apache config outside `src/.htaccess` (vhost, headers, TLS)? If so, that should be linked or vendored into the repo for reproducibility.
- **`FaceOffCritiqueComponent`** — Where is it embedded in templates? It is standalone but not directly attached to a route.
- **`enableDevBlog`** vs **`enableDevlogCreate`** — Are both intended to remain UI-only flags forever, or is one of them headed toward server-side enforcement?
- **Tests** — CI runs Jest on every push/PR via GitHub Actions.
