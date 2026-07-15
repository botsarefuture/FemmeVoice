import { readFile } from "node:fs/promises";

const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url)));
const packageLock = JSON.parse(await readFile(new URL("../package-lock.json", import.meta.url)));
const versionSource = await readFile(new URL("../src/version.js", import.meta.url), "utf8");
const versionMatch = versionSource.match(/APP_VERSION\s*=\s*"([^"]+)"/);

if (!versionMatch || packageJson.version !== versionMatch[1] || packageLock.version !== packageJson.version || packageLock.packages?.[""]?.version !== packageJson.version) {
  console.error("Version mismatch: package.json, package-lock.json, and src/version.js must use the same version.");
  process.exit(1);
}

console.log(`Version ${packageJson.version} is consistent.`);
