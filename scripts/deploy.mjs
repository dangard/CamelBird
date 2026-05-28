/**
 * Build (optional) and upload dist/CamelBird/ to DreamHost over SFTP.
 *
 * Usage:
 *   node scripts/deploy.mjs [--dry-run] [--skip-build]
 *
 * Config: .env.deploy (see .env.deploy.example)
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join, relative, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
import SftpClient from "ssh2-sftp-client";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const distDir = resolve(root, "dist/CamelBird");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const skipBuild = args.includes("--skip-build");

const deployEnv = resolve(root, ".env.deploy");
if (!existsSync(deployEnv)) {
    console.error(
        "Missing .env.deploy — copy .env.deploy.example and fill in your DreamHost settings.",
    );
    process.exit(1);
}
dotenv.config({ path: deployEnv });

function required(name) {
    const value = process.env[name]?.trim();
    if (!value) {
        console.error(`Missing required env var: ${name} (set in .env.deploy)`);
        process.exit(1);
    }
    return value;
}

const host = required("DEPLOY_HOST");
const user = required("DEPLOY_USER");
const remotePath = required("DEPLOY_PATH").replace(/\/+$/, "");
const port = Number.parseInt(process.env.DEPLOY_PORT?.trim() || "22", 10);
const sshKeySetting = required("DEPLOY_SSH_KEY");
const sshKeyPassphrase = process.env.DEPLOY_SSH_KEY_PASSPHRASE?.trim();

if (!remotePath.startsWith("/")) {
    console.warn(
        `Warning: DEPLOY_PATH "${remotePath}" does not look absolute; expected a path like /home/user/www.camelbird.com`,
    );
}

function expandHome(pathValue) {
    return pathValue.startsWith("~")
        ? join(homedir(), pathValue.slice(1).replace(/^[/\\]/, ""))
        : pathValue;
}

function resolveSshKeyPath() {
    const keyPath = resolve(expandHome(sshKeySetting));
    if (!existsSync(keyPath)) {
        console.error(`DEPLOY_SSH_KEY not found: ${keyPath}`);
        process.exit(1);
    }
    return keyPath;
}

function run(command, commandArgs) {
    const result = spawnSync(command, commandArgs, {
        cwd: root,
        stdio: "inherit",
        shell: process.platform === "win32",
    });
    if (result.error) {
        console.error(result.error.message);
        process.exit(1);
    }
    if (result.status !== 0) {
        process.exit(result.status ?? 1);
    }
}

function assertDist() {
    if (!existsSync(distDir)) {
        console.error(`Build output not found: ${distDir}`);
        console.error("Run npm run build first, or omit --skip-build.");
        process.exit(1);
    }
    if (!existsSync(resolve(distDir, "index.html"))) {
        console.error(`Expected index.html in ${distDir}`);
        process.exit(1);
    }
}

function walkLocal(dir, base = dir) {
    const files = [];
    for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        const rel = relative(base, full).replace(/\\/g, "/");
        if (statSync(full).isDirectory()) {
            files.push(...walkLocal(full, base));
        } else {
            files.push(rel);
        }
    }
    return files;
}

async function listRemote(sftp, dir, prefix = "") {
    const files = new Set();
    let entries;
    try {
        entries = await sftp.list(dir);
    } catch (err) {
        if (err.code === 2 || /No such file/i.test(err.message)) {
            return files;
        }
        throw err;
    }

    for (const entry of entries) {
        if (entry.name === "." || entry.name === "..") continue;
        const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
        const remote = `${dir}/${entry.name}`;
        if (entry.type === "d") {
            for (const nested of await listRemote(sftp, remote, rel)) {
                files.add(nested);
            }
        } else {
            files.add(rel);
        }
    }
    return files;
}

function sshAgent() {
    if (process.env.SSH_AUTH_SOCK) {
        return process.env.SSH_AUTH_SOCK;
    }
    if (process.platform === "win32") {
        return "\\\\.\\pipe\\openssh-ssh-agent";
    }
    return undefined;
}

function baseConnectConfig(extra = {}) {
    return {
        host,
        port,
        username: user,
        readyTimeout: 30000,
        tryKeyboard: false,
        ...(sshKeyPassphrase ? { passphrase: sshKeyPassphrase } : {}),
        ...extra,
    };
}

async function connectSftp() {
    const sftp = new SftpClient();
    const keyPath = resolveSshKeyPath();
    const attempts = [];
    let lastAuthError;

    attempts.push(`key ${keyPath}`);
    try {
        await sftp.connect(
            baseConnectConfig({
                privateKey: readFileSync(keyPath),
            }),
        );
        console.log(`Connected with SSH key: ${keyPath}`);
        return sftp;
    } catch (err) {
        await sftp.end().catch(() => {});
        if (/authentication methods failed/i.test(err.message)) {
            lastAuthError = err;
        } else {
            throw err;
        }
    }

    const agent = sshAgent();
    if (agent) {
        attempts.push(`agent ${agent}`);
        try {
            await sftp.connect(baseConnectConfig({ agent }));
            console.log("Connected with SSH agent.");
            return sftp;
        } catch (err) {
            await sftp.end().catch(() => {});
            if (/authentication methods failed/i.test(err.message)) {
                lastAuthError = err;
            } else if (!/failed to connect to agent/i.test(err.message)) {
                throw err;
            }
        }
    }

    console.error(`SSH authentication failed for ${user}@${host}:${port}`);
    console.error(`Tried: ${attempts.join(", ")}`);
    if (lastAuthError?.message) {
        console.error(`Server response: ${lastAuthError.message}`);
    }
    console.error("");
    console.error("Fix:");
    console.error(
        "  1. Ensure the public key for DEPLOY_SSH_KEY is in ~/.ssh/authorized_keys on the server.",
    );
    console.error(
        "  2. Verify login: ssh -i PATH/TO/KEY -p PORT USER@HOST",
    );
    console.error(
        "  3. Use the SSH hostname from the DreamHost panel (e.g. psXXXX.dreamhost.com).",
    );
    console.error(
        "  4. Ensure DEPLOY_USER matches the shell user and DEPLOY_PATH uses the same username.",
    );
    if (sshKeyPassphrase === undefined) {
        console.error(
            "  5. If the key is encrypted, set DEPLOY_SSH_KEY_PASSPHRASE in .env.deploy.",
        );
    }
    process.exit(1);
}

async function ensureRemoteDir(sftp, dir) {
    if (await sftp.exists(dir)) return;
    const parent = dir.replace(/\/[^/]+$/, "");
    if (parent && parent !== dir) {
        await ensureRemoteDir(sftp, parent);
    }
    await sftp.mkdir(dir);
}

async function main() {
    if (!skipBuild) {
        console.log("Building production bundle…");
        run("npm", ["run", "build"]);
    }

    assertDist();

    const localFiles = walkLocal(distDir);
    const localSet = new Set(localFiles);

    console.log("");
    console.log(dryRun ? "Dry-run deploy:" : "Deploying:");
    console.log(`  Source:  ${distDir}/`);
    console.log(`  Target:  ${user}@${host}:${remotePath}/`);
    console.log("");

    const sftp = await connectSftp();
    try {
        const remoteExists = await sftp.exists(remotePath);
        if (!remoteExists) {
            if (dryRun) {
                console.log(`Would create remote directory: ${remotePath}`);
            } else {
                await ensureRemoteDir(sftp, remotePath);
            }
        }

        const remoteFiles = remoteExists
            ? await listRemote(sftp, remotePath)
            : new Set();

        const toDelete = [...remoteFiles].filter((file) => !localSet.has(file));

        if (dryRun) {
            for (const file of localFiles) {
                const action = remoteFiles.has(file) ? "update" : "upload";
                console.log(`  ${action}: ${file}`);
            }
            for (const file of toDelete) {
                console.log(`  delete: ${file}`);
            }
            console.log("");
            console.log(
                `Dry-run complete: ${localFiles.length} file(s) would sync, ${toDelete.length} stale file(s) would be removed.`,
            );
            return;
        }

        for (const file of localFiles) {
            const localPath = join(distDir, file);
            const remoteFile = `${remotePath}/${file}`.replace(/\\/g, "/");
            const remoteDir = remoteFile.replace(/\/[^/]+$/, "");
            await ensureRemoteDir(sftp, remoteDir);
            await sftp.fastPut(localPath, remoteFile);
            console.log(`  uploaded: ${file}`);
        }

        for (const file of toDelete) {
            const remoteFile = `${remotePath}/${file}`.replace(/\\/g, "/");
            await sftp.delete(remoteFile);
            console.log(`  deleted: ${file}`);
        }

        console.log("");
        console.log("Deploy complete.");
    } finally {
        await sftp.end();
    }
}

main().catch((err) => {
    console.error(err.message || err);
    process.exit(1);
});
