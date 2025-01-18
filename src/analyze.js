import { readFileSync } from "fs";
import { join } from "path";
import { globSync } from "glob";
import { parse } from "@babel/parser";
import pkg from "@babel/traverse";
const traverse = pkg.default;

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

  traverse(ast, {
    ImportDeclaration({ node }) {
      node.specifiers.forEach((specifier) => {
        imports.add(specifier.local.name);
      });
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

  return unused.length ? { file: filePath, unused } : null;
}

async function analyzeProject(projectPath) {
  const jsFiles = globSync(
    join(projectPath, "**", "*.{js,jsx,ts,tsx}").replace(/\\/g, "/")
  );
  const report = [];

  console.log(jsFiles);

  for (const file of jsFiles) {
    const result = await analyzeFile(file);
    if (result) report.push(result);
  }

  return report;
}

export { analyzeProject };
