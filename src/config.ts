import fs from "fs";
import path from "path";

export type Config = { apiKey?: string; model?: string };
export const CONFIG = path.join(__dirname, ".config.json");
export const DEFAULT_MODEL = "google/gemini-2.0-flash-lite";

export function readCfg(): Config {
   try {
      return JSON.parse(fs.readFileSync(CONFIG, "utf8"));
   } catch {
      return {};
   }
}
export function writeCfg(c: Config) {
   fs.writeFileSync(CONFIG, JSON.stringify(c, null, 2), { mode: 0o600 });
}
