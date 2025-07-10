#!/usr/bin/env node
/**
 * AI‑assisted git commit (Conventional Commits)
 * Uses native fetch (Node 18+)
 */

import { getCliOptions, ensureCred } from "./cli";
import { readCfg, writeCfg } from "./config";
import { stagedDiff, gitCommit } from "./git";
import { askLunos } from "./lunos";
import pc from "picocolors";

const opt = getCliOptions();
const MODE = opt.long ? "long" : "short";
const cfg = readCfg();

// If -k or -m is provided, update config and exit
if (opt.key || opt.model) {
  const newCfg = { ...cfg };
  if (opt.key) newCfg.apiKey = opt.key;
  if (opt.model) newCfg.model = opt.model;
  writeCfg(newCfg);
  console.log(pc.green("Config updated:"));
  if (opt.key) console.log("  API key set.");
  if (opt.model) console.log(`  Model set to: ${opt.model}`);
  process.exit(0);
}

(async () => {
  const { key, model } = await ensureCred(opt, cfg);
  let diff = stagedDiff();
  const MAX_DIFF_LENGTH = 10000;
  if (diff.length > MAX_DIFF_LENGTH) {
    diff =
      diff.slice(0, MAX_DIFF_LENGTH) +
      "\n\n--- Diff truncated due to length limit ---";
  }

  let basePrompt;
  if (MODE === "long") {
    basePrompt = `
Based on the git diff below, generate a Conventional Commit message.

Format:
type(optional-scope)!: short description

(optional body)

BREAKING CHANGE: details (if any)

Guidelines:
- Present tense, ≤60‑char subject, no trailing period
- Body lines ≤72 chars
- Follow the diff's intent

Diff:
${diff}
`;
  } else {
    basePrompt = `
Based on the git diff below, generate ONLY the short Conventional Commit message title (type: short description) in present tense, ≤60 chars, no trailing period. Do NOT include a body or BREAKING CHANGE footer.

Diff:
${diff}
`;
  }

  let full = await askLunos(key, model, basePrompt, MODE);

  while (true) {
    console.log(pc.cyan("\nProposed commit:\n"));
    console.log(pc.green("---"));
    console.log(full);
    console.log(pc.green("---\n"));

    const inquirer = await import("inquirer");
    const { act } = await inquirer.default.prompt([
      {
        type: "list",
        name: "act",
        message: "Accept message?",
        choices: ["✅ Commit", "🔄 Regenerate", "❌ Cancel"],
      },
    ]);
    if (act === "✅ Commit") {
      const [header, ...rest] = full.split("\n").map((l) => l.trim());
      let body, footer;
      if (MODE === "long") {
        const parts = rest.join("\n").split(/BREAKING CHANGE:/);
        body = parts[0].trim() || undefined;
        footer = parts[1] ? "BREAKING CHANGE: " + parts[1].trim() : undefined;
      }
      gitCommit(header, body, footer);
      break;
    }
    if (act === "❌ Cancel") {
      console.log(pc.yellow("Aborted."));
      process.exit(0);
    }
    full = await askLunos(
      key,
      model,
      basePrompt + "\n\nPlease regenerate with different wording.",
      MODE
    );
  }
})();
