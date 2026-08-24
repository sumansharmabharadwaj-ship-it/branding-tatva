import { spawn } from "node:child_process";

const args = process.argv.slice(2);
const portIndex = args.indexOf("--port");
const port = portIndex >= 0 ? args[portIndex + 1] : "4173";

const child = spawn("next", ["start", "--hostname", "0.0.0.0", "--port", port], {
  stdio: "inherit",
  shell: false,
});

child.on("exit", (code) => process.exit(code ?? 0));
