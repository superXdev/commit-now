import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import { readCfg, writeCfg, DEFAULT_MODEL, Config } from "./config";

export function getCliOptions() {
   const program = new Command();
   program
      .option("-s, --short", "short message (title only)")
      .option("-l, --long", "long message (title + body)")
      .option("-k, --key <API_KEY>", "Lunos API key")
      .option("-m, --model <MODEL_ID>", "Lunos model id")
      .parse(process.argv);
   return program.opts();
}

export async function ensureCred(
   opt: any,
   cfg: Config
): Promise<{ key: string; model: string }> {
   let key = opt.key || process.env.LUNOS_API_KEY || cfg.apiKey;
   let model = opt.model || cfg.model || DEFAULT_MODEL;

   if (!key) {
      const a = await inquirer.prompt([
         { type: "password", name: "key", message: "Enter Lunos API key:" },
         { type: "confirm", name: "save", message: "Save key?", default: true },
         {
            type: "input",
            name: "model",
            message: `Default model? (${DEFAULT_MODEL})`,
            default: DEFAULT_MODEL,
         },
      ]);
      key = a.key.trim();
      model = (a.model || DEFAULT_MODEL).trim();
      if (a.save) writeCfg({ apiKey: key, model });
   }
   return { key, model };
}
