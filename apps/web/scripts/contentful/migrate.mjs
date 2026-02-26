import { spawnSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

// Load .env.local if it exists
const envPath = path.join(process.cwd(), ".env.local");
console.log(`Checking for .env.local at: ${envPath}`);
if (fs.existsSync(envPath)) {
  console.log("Found .env.local, loading variables...");
  const envFile = fs.readFileSync(envPath, "utf-8");
  envFile.split("\n").forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) return;
    
    const [key, ...valueParts] = trimmedLine.split("=");
    if (key && valueParts.length > 0) {
      const value = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
      process.env[key.trim()] = value;
    }
  });
} else {
  console.log(".env.local not found in current directory.");
}

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const environmentId = process.env.CONTENTFUL_ENVIRONMENT || "master";
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

console.log(`Space ID: ${spaceId ? "Found" : "Missing"}`);
console.log(`Management Token: ${managementToken ? managementToken.substring(0, 5) + "..." : "Missing"}`);

if (!spaceId || !managementToken) {
  console.error(
    [
      "Missing required env vars for Contentful migration.",
      "",
      "Required:",
      "  - CONTENTFUL_SPACE_ID",
      "  - CONTENTFUL_MANAGEMENT_TOKEN",
      "",
      "Optional:",
      "  - CONTENTFUL_ENVIRONMENT (defaults to 'master')",
    ].join("\n"),
  );
  process.exit(1);
}

const isWin = process.platform === "win32";
const migrationFile =
  process.env.CONTENTFUL_MIGRATION_FILE ||
  path.join("contentful", "migrations", "001-initial-schema.js");

const contentfulBin = isWin ? "npx.cmd" : "npx";

const args = [
  "contentful",
  "space",
  "migration",
  migrationFile,
  "--space-id",
  spaceId,
  "--environment-id",
  environmentId,
  "--management-token",
  managementToken,
  "--yes",
];

const result = spawnSync(contentfulBin, args, {
  stdio: "inherit",
  env: { ...process.env },
  shell: isWin,
});

if (result.error) {
  console.error("Failed to start migration process:", result.error);
}

process.exit(result.status ?? 1);

