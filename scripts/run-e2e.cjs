const { spawn } = require("node:child_process");

const root = require("node:path").resolve(__dirname, "..");
const server = spawn(process.execPath, ["scripts/serve.cjs", "4174"], {
  cwd: root,
  stdio: ["ignore", "pipe", "inherit"],
});
let testProcess = null;
let finished = false;

function stop(code) {
  if (finished) return;
  finished = true;
  if (!server.killed) server.kill();
  const timer = setTimeout(() => process.exit(code), 1200);
  timer.unref();
  server.once("exit", () => process.exit(code));
}

const startupTimer = setTimeout(() => {
  console.error("Timed out while starting the Playwright test server.");
  stop(1);
}, 10000);

server.stdout.on("data", (chunk) => {
  const output = chunk.toString();
  process.stdout.write(output);
  if (testProcess || !output.includes("Test server listening")) return;
  clearTimeout(startupTimer);
  const cli = require.resolve("@playwright/test/cli");
  testProcess = spawn(
    process.execPath,
    [cli, "test", ...process.argv.slice(2)],
    { cwd: root, stdio: "inherit" },
  );
  testProcess.once("exit", (code) => stop(code || 0));
  testProcess.once("error", (error) => {
    console.error(error);
    stop(1);
  });
});

server.once("error", (error) => {
  console.error(error);
  stop(1);
});
server.once("exit", (code) => {
  if (!finished && !testProcess) stop(code || 1);
});

process.once("SIGINT", () => {
  testProcess?.kill();
  stop(130);
});
process.once("SIGTERM", () => {
  testProcess?.kill();
  stop(143);
});
