import { readFileSync, existsSync } from "fs";
import { join } from "path";
import chalk from "chalk"

var LOGGING_ENABLED = false;

function loggingEnabled(){
  return LOGGING_ENABLED;
}

function setLoggingEnabled(val:boolean){
  LOGGING_ENABLED = val;
}

async function getIgnoredFiles() {
  const path = join(process.cwd(), ".mpignore");
  
  if (!existsSync(path)) {
    console.log(chalk.yellow(`⚠️  No .mpignore file found. Nothing to ignore.`));
    return [];
  }

  const config = readFileSync(path, "utf-8");

  const fileList = config.split("\n");
  console.log(chalk.rgb(255, 170, 0).visible("🚫 Ignoring: "));
  fileList.forEach((file) => {
    console.log(chalk.red(`  - ${file}`))
  });

  console.log()

  return fileList;
}

export { getIgnoredFiles, setLoggingEnabled, loggingEnabled };
