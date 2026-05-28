<!--
Sync Impact Report
- Version change: 1.0.0 → 1.0.1
- Principles: III (Automated quality gates) — local verify only; no GitHub Actions.
- Added sections: none
- Removed: `.github/workflows/ci.yml` reference
- Templates: plan-template.md Constitution Check ✅ updated
- Follow-ups: None.
-->

# CamelBird Portfolio Constitution

## Core Principles

### I. Visitor-first presentation

This repository exists as a **personal portfolio**: it MUST communicate **work history**, **development
skills**, and **authentic personal context** clearly to visitors. Navigation, typography, and content
structure MUST remain understandable; regressions to accessibility or readability MUST be remediated or
explicitly justified in review.

### II. Stack fidelity

Implementation MUST honor the **Angular 20 standalone SPA** architecture described in
`docs/ARCHITECTURE.md`. Configuration MUST flow through the documented **`.env` →
`environment.generated.ts`** pipeline (`scripts/generate-environment.mjs`, `.env.example`); MUST NOT
introduce duplicate sources of truth for public bundle config without updating `.env.example` and
docs.

### III. Automated quality gates

Changes MUST keep **`npm run lint`**, **`npm test`**, and production **`npm run build`** passing
before merge (run locally or via **`npm run verify`**). Application repositories MUST NOT use
**GitHub Actions** or other hosted CI workflows. Logic-affecting changes SHOULD update or add **Jest**
tests when practical.

### IV. Honest security posture

**Feature flags and UI toggles MUST be treated as UX-only controls.** MUST NOT imply that hiding UI
elements constitutes authorization. Sensitive behavior MUST remain enforceable on **server-side /
API** boundaries external to this SPA when applicable.

### V. Documentation honesty

Material changes to **hosting**, **API usage**, **`NG_APP_*` environment keys**, or **routing**
MUST update **`docs/ARCHITECTURE.md`** and/or **`docs/APACHE_CONFIG.md`** as appropriate so deployed
reality matches repo truth.

## Stack & deployment reality

- **Frontend**: Angular application builder → static bundle under `dist/CamelBird`; Bootstrap CSS plus
  SCSS palette tokens (`src/assets/styles/colors.scss`).
- **Hosting**: Apache static site with SPA fallback (`src/.htaccess`); optional header/TLS guidance
  in `docs/APACHE_CONFIG.md`.
- **Dynamic data**: Dev blog consumes an **external REST API** (base URL from `NG_APP_API_SERVER_URL`);
  backend ownership and auth live **outside** this repository.

## Workflow & Speckify alignment

- **Local verification**: Follow `package.json` scripts (`prepare`, `prelint`, `pretest`, `start`,
  `build`, `postbuild`, `verify`) for environment generation and pre-merge checks.
- **Speckify**: Feature work using Speckit MUST keep `spec.md`, `plan.md`, and `tasks.md` consistent
  with this constitution; plans MUST include a **Constitution Check** pass (see
  `.specify/templates/plan-template.md`).

## Governance

- This constitution **supersedes** informal habits when they conflict with written rules.
- **Amendments** require an intentional **semantic version** bump of `CONSTITUTION_VERSION`,
  **`LAST_AMENDED_DATE`** update (ISO `YYYY-MM-DD`), and—when gates change—sync updates to dependent
  templates (notably `plan-template.md` Constitution Check).
- **Compliance**: Pull requests SHOULD call out which principles are touched; complexity or
  exceptions MUST be justified in the PR or plan notes.
- **Runtime technical reference**: Prefer `docs/ARCHITECTURE.md` for architecture truth.

**Version**: 1.0.1 | **Ratified**: 2026-05-13 | **Last Amended**: 2026-05-28
