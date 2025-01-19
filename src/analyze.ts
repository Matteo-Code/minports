import { readFileSync } from "fs";
import { join, normalize, sep } from "path";
import { globSync } from "glob";
import { parse, ParseResult } from "@babel/parser";
import type { NodePath } from "@babel/traverse";
// import { traverse } from "./lib/traverse.js";
import _traverse from "@babel/traverse";
import type * as BabelTypes from "@babel/types";
import chalk from "chalk";
import { getPackages } from "./packages";
import { getIgnoredFiles, loggingEnabled } from "./config";
import { AnalysisReport } from "./types/report";

const traverse = (_traverse as any).default as typeof _traverse;

var unusedPackages: Set<string> = new Set<string>;

async function getPackageList(){
  unusedPackages = await getPackages();
}

getPackageList();

function parseCode(code: string): ParseResult<BabelTypes.File> {
  return parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript", "decorators-legacy", "classProperties"],
  });
}

export async function analyzeFile(
  filePath: string
): Promise<{ file: string; unused: string[] } | null> {
  const code = readFileSync(filePath, "utf-8");
  const ast = parseCode(code);

  const imports = new Set<string>();
  const usedIdentifiers = new Set<string>();

  const usedPackages = new Set<string>();

  if (loggingEnabled()) {
    console.log(chalk.magenta("ℹ️ Checking file: " + filePath));
  }

  traverse(ast, {
    ImportDeclaration({ node }: NodePath<BabelTypes.ImportDeclaration>) {
      node.specifiers.forEach((specifier) => {
        imports.add(specifier.local.name);
      });
      usedPackages.add(node.source.value);
    },

    Identifier(path: NodePath<BabelTypes.Identifier>) {
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
    JSXOpeningElement(path: NodePath<BabelTypes.JSXOpeningElement>) {
      if (path.node.name.type === "JSXIdentifier") {
        usedIdentifiers.add(path.node.name.name);
      }
    },

    JSXClosingElement(path: NodePath<BabelTypes.JSXClosingElement>) {
      if (path.node.name.type === "JSXIdentifier") {
        usedIdentifiers.add(path.node.name.name);
      }
    },
    ClassMethod(path: NodePath<BabelTypes.ClassMethod>) {
      if (path.node.kind === "constructor") {
        path.node.params.forEach((param) => {
          if (
            param.type === "TSParameterProperty" &&
            param.parameter.type === "Identifier" &&
            param.decorators
          ) {
            param.decorators.forEach((decorator) => {
              if (decorator.expression.type === "Identifier") {
                usedIdentifiers.add(decorator.expression.name);
              } else if (decorator.expression.type === "CallExpression") {
                const callee = decorator.expression.callee;
                if (callee.type === "Identifier") {
                  usedIdentifiers.add(callee.name);
                }
              }
            });
          }
        });
      }
    },
  });

  const unused = [...imports].filter((imp) => !usedIdentifiers.has(imp));

  [...unusedPackages]
    .filter((dep) => usedPackages.has(dep))
    .forEach((dep) => {
      unusedPackages.delete(dep);
    });

  return unused.length ? { file: filePath, unused } : null;
}

export async function analyzeProject(projectPath: string): Promise<{
  imports: Array<{ file: string; unused: string[] }>;
  packages: string[];
}> {
  const ignoredFiles = await getIgnoredFiles();

  let jsFiles = globSync(
    join(projectPath, "**", "*.{js,jsx,ts,tsx}").replace(/\\/g, "/")
  );

  jsFiles = jsFiles.map((file) => normalize(file));

  jsFiles = jsFiles.filter((file) => {
    return !ignoredFiles.some((ignoredPath) => {
      const normalizedFile = normalize(file);
      const normalizedIgnore = normalize(join(projectPath, ignoredPath.trim()));
      return (
        normalizedFile === normalizedIgnore ||
        normalizedFile.startsWith(normalizedIgnore + sep)
      );
    });
  });

  const report: AnalysisReport = { imports: [], packages: [] };

  for (const file of jsFiles) {
    const result = await analyzeFile(file);
    if (result) {
      report.imports.push(result);
    }
  }

  [...unusedPackages].forEach((dep) => report.packages.push(dep));

  return report;
}
