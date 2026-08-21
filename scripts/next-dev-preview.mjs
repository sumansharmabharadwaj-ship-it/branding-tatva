import { spawn } from "node:child_process";

const forwarded = process.argv.slice(2);
const nextArgs = ["node_modules/next/dist/bin/next", "dev"];

for (let index = 0; index < forwarded.length; index += 1) {
  const argument = forwarded[index];

  if (argument === "--strictPort") continue;

  if (argument === "--host" || argument === "--hostname") {
    const host = forwarded[index + 1];
    if (host) {
      nextArgs.push("--hostname", host);
      index += 1;
    }
    continue;
  }

  nextArgs.push(argument);
}

const child = spawn(process.execPath, nextArgs, {
  env: process.env,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exitCode = code ?? 1;
});
