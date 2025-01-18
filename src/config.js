import { readFileSync } from "fs";
import { join } from "path";
import chalk from "chalk"

async function getIgnoredFiles() {
  const path = join(process.cwd(), ".mpignore");

  const config = readFileSync(path, "utf-8");

  const fileList = config.split("\n");
  console.log(chalk.rgb(255, 170, 0).visible("🚫 Ignoring: "));
  fileList.forEach((file) => {
    console.log(chalk.red(`  - ${file}`))
  });

  console.log()

  return fileList;
}

export { getIgnoredFiles };
