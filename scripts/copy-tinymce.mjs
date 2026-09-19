import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "node_modules", "tinymce");
const dest = join(root, "public", "tinymce");

if (!existsSync(source)) {
  console.warn("tinymce is not installed; skip copy.");
  process.exit(0);
}

mkdirSync(join(root, "public"), { recursive: true });
cpSync(source, dest, { recursive: true });
console.log(`Copied TinyMCE to ${dest}`);
