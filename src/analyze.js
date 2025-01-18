import { readFileSync } from "fs";
import { join, normalize } from "path";
import { globSync } from "glob";
import { parse } from "@babel/parser";
import pkg from "@babel/traverse";
import { getPackages } from "./packages.js";
import {getIgnoredFiles, loggingEnabled} from "./config.js";
import chalk from "chalk";
const traverse = pkg.default;

const unusedPackages = await getPackages();

const parseCode = (code) =>
  parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript", "decorators-legacy", "classProperties"],
  });

async function analyzeFile(filePath) {
  const code = readFileSync(filePath, "utf-8");
  const ast = parseCode(code);

  const imports = new Set();
  const usedIdentifiers = new Set();

  const usedPackages = new Set();

  if(loggingEnabled()){
    console.log(chalk.magenta("ℹ️ Checking file: " + filePath));
  }

  traverse(ast, {
    ImportDeclaration({ node }) {
      node.specifiers.forEach((specifier) => {
        imports.add(specifier.local.name);
      });
      usedPackages.add(node.source.value);
    },

    Identifier(path) {
      if (
        path.parent.type === "ImportSpecifier" ||
        path.parent.type === "ImportDefaultSpecifier" ||
        path.parent.type === "ImportNamespaceSpecifier" ||
        path.parent.type === "ExportSpecifier"
      ) {
        return;
      }

      usedIdentifiers.add(path.node.name);
    },
  });

  const unused = [...imports].filter((imp) => !usedIdentifiers.has(imp));

  [...unusedPackages].filter((dep) => usedPackages.has(dep)).forEach((dep) => {
    unusedPackages.delete(dep);
  });

  return unused.length ? { file: filePath, unused } : null;
}

async function analyzeProject(projectPath) {

  const ignoredFiles = await getIgnoredFiles();

  var jsFiles = globSync(
    join(projectPath, "**", "*.{js,jsx,ts,tsx}").replace(/\\/g, "/")
  );
  jsFiles = jsFiles.filter((file) => {
    return !ignoredFiles.some((ignoredPath) => {
      const normalizedFile = normalize(file);
      const normalizedIgnore = normalize(join(projectPath, ignoredPath.trim()));
      return normalizedFile === normalizedIgnore || normalizedFile.startsWith(normalizedIgnore + "\\");
    });
  });

  const report = {imports: [], packages: []};

  for (const file of jsFiles) {
    const result = await analyzeFile(file);
    if (result) report.imports.push(result);
  }

  [...unusedPackages].forEach((dep) => report.packages.push(dep));

  return report;
}

export { analyzeProject, analyzeFile };
