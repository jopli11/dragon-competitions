import { spawnSync } from "node:child_process";
import path from "node:path";

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const environmentId = process.env.CONTENTFUL_ENVIRONMENT || "master";
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

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
const contentfulBin = isWin
  ? path.join(process.cwd(), "node_modules", ".bin", "contentful.cmd")
  : path.join(process.cwd(), "node_modules", ".bin", "contentful");

const migrationFile =
  process.env.CONTENTFUL_MIGRATION_FILE ||
  path.join("contentful", "migrations", "001-initial-schema.js");

const args = [
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
  env: process.env,
});

process.exit(result.status ?? 1);

