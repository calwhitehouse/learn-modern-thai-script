#!/usr/bin/env node
/**
 * Pre-deploy security checks. Run: node scripts/verify-security.mjs
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const srcDir = path.join(root, "src");
let failed = false;

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  failed = true;
}

function pass(msg) {
  console.log(`OK: ${msg}`);
}

function walk(dir) {
  const entries = [];
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) entries.push(...walk(full));
    else if (/\.(ts|tsx|js|mjs)$/.test(name.name)) entries.push(full);
  }
  return entries;
}

for (const file of walk(srcDir)) {
  const text = fs.readFileSync(file, "utf8");
  if (/service_role|sb_secret_|SUPABASE_SERVICE/i.test(text) && !file.endsWith("env.ts")) {
    fail(`Suspicious secret reference in ${path.relative(root, file)}`);
  }
}

try {
  const tracked = execSync("git ls-files", { cwd: root, encoding: "utf8" });
  if (tracked.split("\n").some((f) => f === ".env.local")) {
    fail(".env.local is tracked by git");
  } else {
    pass(".env.local is not tracked");
  }
} catch {
  console.warn("Skip: git ls-files unavailable");
}

if (fs.existsSync(path.join(root, ".env.local"))) {
  pass(".env.local exists locally (gitignored)");
}

pass("Source scan complete (see failures above)");
process.exit(failed ? 1 : 0);
