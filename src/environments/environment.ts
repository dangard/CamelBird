/**
 * Runtime configuration is injected at build time from `.env`
 * (`scripts/generate-environment.mjs` → environment.generated.ts).
 * See `.env.example`.
 */
export { environment } from "./environment.generated";
export type { Environment } from "./environment.generated";
