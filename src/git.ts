import { execSync } from "child_process";
import chalk from "chalk";

export function stagedDiff(): string {
   // Check for unstaged changes
   const unstaged = execSync("git diff --name-only", { encoding: "utf8" });
   if (unstaged.trim()) {
      console.log(chalk.yellow("Staging all unstaged changes..."));
      execSync("git add -A", { stdio: "inherit" });
   }
   const diff = execSync("git diff --cached", { encoding: "utf8" });
   if (!diff.trim()) {
      console.log(chalk.yellow("No staged changes."));
      process.exit(0);
   }
   return diff;
}

export function gitCommit(head: string, body?: string, footer?: string) {
   function wrap(msg?: string) {
      if (!msg) return undefined;
      return '"' + msg.replace(/\"/g, '\\"').replace(/"/g, '\\"') + '"';
   }
   const args = ["git", "commit", "-m", wrap(head)];
   if (body) args.push("-m", wrap(body));
   if (footer) args.push("-m", wrap(footer));
   execSync(args.join(" "), { stdio: "inherit" });
}
