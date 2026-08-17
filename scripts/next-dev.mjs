import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");
const forwarded = process.argv.slice(2);
const isSitesPreview = forwarded.includes("--strictPort");
const args = [isSitesPreview ? "start" : "dev"];

for (let index = 0; index < forwarded.length; index += 1) {
  const argument = forwarded[index];
  if (argument === "--strictPort") continue;
  if (argument === "--host") {
    args.push("-H");
    continue;
  }
  args.push(argument);
}

const child = spawn(process.execPath, [nextBin, ...args], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});
