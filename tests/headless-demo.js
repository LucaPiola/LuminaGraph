#!/usr/bin/env node

const path = require("path");
const {
  STGraphXHeadlessRuntime,
} = require("../headless-runtime.js");

async function main() {
  const rootDir = path.resolve(__dirname, "..");
  const runtime = await STGraphXHeadlessRuntime.load({
    src: "tests/player_smoke_widgets.json",
    basePath: rootDir,
    lang: "it",
    onProgress(info) {
      if (info.phase === "step" || info.phase === "runUntil") {
        console.log(`[progress] phase=${info.phase} time=${info.time} history=${info.historyLength}`);
      }
    },
  });

  await runtime.setValues({
    gain: 1.5,
    gate: 1,
    mode: 0,
  }, { evaluate: true });

  console.log("Settable nodes:", runtime.getSettableNames().join(", "));
  console.log("Initial outputs:", runtime.getOutputs());

  await runtime.runUntil(1);

  console.log("Outputs at t=1:", runtime.getOutputs());

  const csvPath = await runtime.writeOutputHistoryCsv(path.join(rootDir, "tmp-headless", "headless-demo.csv"), {
    names: ["gain", "x", "dx"],
  });

  console.log("CSV written to:", csvPath);
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : String(error));
  process.exit(1);
});
