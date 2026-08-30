#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = process.env.CONTACT_AUDIT_PORT || "4173";
const baseUrl = `http://127.0.0.1:${port}`;

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: "inherit",
      shell: false,
      ...options,
    });
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with ${code ?? signal}`));
    });
  });
}

function output(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: ["ignore", "pipe", "inherit"],
      shell: false,
    });
    let value = "";
    child.stdout.on("data", (chunk) => {
      value += chunk;
    });
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) resolve(value.trim());
      else reject(new Error(`${command} exited with ${code ?? signal}`));
    });
  });
}

function cachedHeadlessShell() {
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE) {
    return process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
  }

  const cacheRoot = path.join(os.homedir(), ".cache", "ms-playwright");
  if (!fs.existsSync(cacheRoot)) return null;

  const candidates = fs
    .readdirSync(cacheRoot)
    .filter((entry) => entry.startsWith("chromium_headless_shell-"))
    .sort((left, right) => {
      const leftVersion = Number(left.split("-").at(-1)) || 0;
      const rightVersion = Number(right.split("-").at(-1)) || 0;
      return rightVersion - leftVersion;
    })
    .map((entry) => path.join(cacheRoot, entry, "chrome-linux", "headless_shell"))
    .find((candidate) => fs.existsSync(candidate));

  return candidates || null;
}

async function waitForServer(preview) {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (preview.exitCode !== null) {
      throw new Error(`Contact preview exited before becoming ready (${preview.exitCode}).`);
    }
    try {
      const response = await fetch(`${baseUrl}/contact`);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Contact preview did not become ready at ${baseUrl}.`);
}

let preview = null;

try {
  await run("npm", ["run", "build"]);

  preview = spawn(
    process.execPath,
    [path.join(projectRoot, "scripts", "sites-preview-dev.mjs"), "--port", port],
    {
      cwd: projectRoot,
      stdio: "inherit",
      shell: false,
    },
  );
  await waitForServer(preview);

  const commit = await output("git", ["rev-parse", "HEAD"]);
  const executable = cachedHeadlessShell();
  await run(process.execPath, [path.join(projectRoot, "scripts", "contact_hosted_gate.cjs")], {
    env: {
      ...process.env,
      AUDIT_BASE_URL: baseUrl,
      AUDIT_COMMIT: commit,
      ...(executable ? { PLAYWRIGHT_CHROMIUM_EXECUTABLE: executable } : {}),
    },
  });
} finally {
  if (preview && preview.exitCode === null) {
    preview.kill("SIGTERM");
  }
}
