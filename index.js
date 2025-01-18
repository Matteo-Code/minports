#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { analyzeProject } from './src/analyze.js';
import { refactorImports } from './src/refactor.js';

program
  .version('1.0.0')
  .description('Scan projects for unused imports and optimize them.')
  .option('-p, --path <path>', 'Path to the project', '.')
  .option('-r, --refactor', 'Automatically refactor imports')
  .parse(process.argv);

const options = program.opts();

console.log(chalk.blueBright('🔍 Scanning for unused imports...'));

analyzeProject(options.path)
  .then((report) => {
    if (report.length === 0) {
      console.log(chalk.green('🎉 No unused imports found!'));
    } else {
      console.log(chalk.yellow('⚠️ Unused Imports Found:\n'));
      report.forEach(({ file, unused }) => {
        console.log(chalk.cyan(`File: ${file}`));
        unused.forEach((imp) =>
          console.log(chalk.red(`  - ${imp}`))
        );
      });

      if (options.refactor) {
        console.log(chalk.blue('✍️ Refactoring imports...'));
        refactorImports(report);
        console.log(chalk.green('✅ Imports optimized!'));
      }
    }
  })
  .catch((err) => console.error(chalk.red(`Error: ${err.message}`)));
