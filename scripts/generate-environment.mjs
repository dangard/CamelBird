/**
 * Writes src/environments/environment.generated.ts from process.env plus .env files.
 *
 * Usage: node scripts/generate-environment.mjs <development|production>
 *
 * Public keys (bundled into the SPA): NG_APP_* (see .env.example).
 */

import { writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const mode = process.argv[2] === "production" ? "production" : "development";

const layered = resolve(root, `.env.${mode}`);
const base = resolve(root, ".env");
if (existsSync(base)) {
    dotenv.config({ path: base });
}
if (existsSync(layered)) {
    dotenv.config({ path: layered, override: true });
}

const prod = mode === "production";

/** Defaults when `NG_APP_*` is unset (production vs development mode). */
const defaults = prod
    ? {
          apiServerUrl: "https://api.camelbird.com",
          enableDevlogCreate: false,
          enableDevBlog: true,
      }
    : {
          apiServerUrl: "http://localhost",
          enableDevlogCreate: true,
          enableDevBlog: true,
      };

function envString(key, fallback) {
    const v = process.env[key];
    return v !== undefined && v.trim() !== "" ? v.trim() : fallback;
}

function envBool(key, fallback) {
    const v = process.env[key];
    if (v === undefined || v.trim() === "") return fallback;
    return /^true|1|yes$/i.test(v.trim());
}

const environment = {
    production: prod,
    apiServerUrl: envString("NG_APP_API_SERVER_URL", defaults.apiServerUrl),
    enableDevlogCreate: envBool(
        "NG_APP_ENABLE_DEVLOG_CREATE",
        defaults.enableDevlogCreate,
    ),
    enableDevBlog: envBool("NG_APP_ENABLE_DEV_BLOG", defaults.enableDevBlog),
};

const outfile = resolve(root, "src/environments/environment.generated.ts");
const banner = `// AUTO-GENERATED - do not edit. Created by scripts/generate-environment.mjs (${mode})\n\n`;

const body =
    `${banner}` +
    `export const environment = ${JSON.stringify(environment, null, 4)} as const;

export type Environment = typeof environment;
`;

writeFileSync(outfile, body, "utf8");
console.log(`Wrote ${outfile} (${mode})`);
