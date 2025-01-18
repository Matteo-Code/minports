import { readFileSync } from "fs";
import { join } from "path";
import { globSync } from "glob";
import { parse } from "@babel/parser";
import pkg from "@babel/traverse";
import { getPackages } from "./packages.js";
const traverse = pkg.default;

const unusedPackages = await getPackages();

const parseCode = (code) =>
  parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

async function analyzeFile(filePath) {
  const code = readFileSync(filePath, "utf-8");
  const ast = parseCode(code);

  const imports = new Set();
  const usedIdentifiers = new Set();

  const usedPackages = new Set();

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

  console.log("End result after checking " + filePath + " - ")
  console.log(unusedPackages)

  return unused.length ? { file: filePath, unused } : null;
}

async function analyzeProject(projectPath) {
  const jsFiles = globSync(
    join(projectPath, "**", "*.{js,jsx,ts,tsx}").replace(/\\/g, "/")
  );
  const report = {imports: [], packages: []};

  for (const file of jsFiles) {
    const result = await analyzeFile(file);
    if (result) report.imports.push(result);
  }

  [...unusedPackages].forEach((dep) => report.packages.push(dep));

  return report;
}

export { analyzeProject };
