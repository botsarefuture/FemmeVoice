import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const [base, head = "HEAD"] = process.argv.slice(2);
if (!base || /^0+$/.test(base)) process.exit(0);

let previous;
try {
  previous = JSON.parse(execFileSync("git", ["show", `${base}:package.json`], { encoding: "utf8" })).version;
} catch {
  process.exit(0);
}

const current = JSON.parse(await readFile(new URL("../package.json", import.meta.url))).version;
const parse = (version) => {
  const match = String(version).match(/^(\d+)\.(\d+)\.(\d+)(?:-.+)?$/);
  if (!match) throw new Error(`Expected a semantic version, received ${version}.`);
  return match.slice(1).map(Number);
};
const compare = (left, right) => left.findIndex((part, index) => part !== right[index]);

try {
  const currentParts = parse(current);
  const previousParts = parse(previous);
  const firstDifference = compare(currentParts, previousParts);
  if (firstDifference === -1 || currentParts[firstDifference] < previousParts[firstDifference]) throw new Error(`Version must increase from ${previous} to push updates; current version is ${current}.`);
  console.log(`Version bump confirmed: ${previous} -> ${current}.`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
