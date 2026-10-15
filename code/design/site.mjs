// Where the site's dev server is, worked out the same way code/_site.py does it.
//   site folder = the folder you run the tool from (run from the site root)
//   env         = <engine>/.env, then <site>/.env (the site wins), and a
//                 variable already set in the shell wins over both
//   base URL    = http://localhost:DEV_PORT, else http://localhost:3000
// --port N or --base URL on the command line override it.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const ROOT = process.cwd();
export const ENGINE = path.resolve(path.dirname(fs.realpathSync(fileURLToPath(import.meta.url))), "..", "..");

function readEnv(file) {
  const out = {};
  let text;
  try { text = fs.readFileSync(file, "utf8"); } catch { return out; }
  for (let line of text.split(/\r?\n/)) {
    line = line.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    if (line.startsWith("export ")) line = line.slice(7);
    const i = line.indexOf("=");
    out[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

const merged = readEnv(path.join(ENGINE, ".env"));
if (path.resolve(ROOT) !== ENGINE) Object.assign(merged, readEnv(path.join(ROOT, ".env")));
for (const [k, v] of Object.entries(merged)) if (!(k in process.env)) process.env[k] = v;

export const PORT = (process.env.DEV_PORT || "").trim() || "3000";

export function baseUrl(argv = process.argv) {
  let base = `http://localhost:${PORT}`;
  const p = argv.indexOf("--port"), b = argv.indexOf("--base");
  if (p >= 0) base = `http://localhost:${argv[p + 1]}`;
  if (b >= 0) base = argv[b + 1].replace(/\/+$/, "");
  return base;
}
