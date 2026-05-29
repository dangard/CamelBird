/**
 * Writes src/environments/environment.generated.ts from process.env plus .env files.
 *
 * Usage: node scripts/generate-environment.mjs <development|production>
 *
 * Bundle config: API_URL (see .env.example).
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

/** Defaults when `API_URL` is unset (production vs development mode). */
const defaults = prod
    ? { apiUrl: "https://api.camelbird.com" }
    : { apiUrl: "http://localhost" };

function envString(key, fallback) {
    const v = process.env[key];
    return v !== undefined && v.trim() !== "" ? v.trim() : fallback;
}

const environment = {
    production: prod,
    apiUrl: envString("API_URL", defaults.apiUrl),
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
