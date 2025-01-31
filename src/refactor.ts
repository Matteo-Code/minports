import { readFileSync, writeFileSync } from "fs";
import { UnusedImport } from "./types/report";

function refactorImports(report: UnusedImport[]): void {
  report.forEach(({ file, unused }) => {
    let content = readFileSync(file, "utf-8");

    unused.forEach((imp) => {
      const patterns = [
        `import\\s*{[^}]*\\b(?:${imp}(?:\\s+as\\s+\\w+)?|\\w+\\s+as\\s+${imp})\\b[^}]*}\\s*from\\s*['"][^'"]+['"];?`,
        `import\\s+\\b(?:${imp})(?:\\s+as\\s+\\w+)?\\b\\s+from\\s+['"][^'"]+['"];?`,
        `import\\s+(?:(?:\\b(?:${imp})(?:\\s+as\\s+\\w+)?\\b\\s*,\\s*{[^}]+})|(?:[^,]+,\\s*{[^}]*\\b(?:${imp}(?:\\s+as\\s+\\w+)?|\\w+\\s+as\\s+${imp})\\b[^}]*}))\\s*from\\s+['"][^'"]+['"];?`,
        `import\\s*\\*\\s*as\\s*\\b${imp}\\b\\s*from\\s*['"][^'"]+['"];?`,
        `(?:const|let|var)\\s+\\b${imp}\\b\\s*=\\s*require\\(['"][^'"]+['"]\\);?`,
        `(?:const|let|var)\\s*{[^}]*\\b(?:${imp}(?:\\s+as\\s+\\w+)?|\\w+\\s+as\\s+${imp})\\b[^}]*}\\s*=\\s*require\\(['"][^'"]+['"]\\);?`,
      ];

      patterns.forEach((pattern) => {
        const regex = new RegExp(pattern, "g");
        content = content.replace(regex, (match) => {
          if (match.includes(",") && match.includes("{")) {
            const updatedMatch = match
              .replace(
                new RegExp(
                  `\\s*\\b(?:${imp}(?:\\s+as\\s+\\w+)?|\\w+\\s+as\\s+${imp})\\b\\s*,?|,?\\s*\\b(?:${imp}(?:\\s+as\\s+\\w+)?|\\w+\\s+as\\s+${imp})\\b\\s*`,
                  "g"
                ),
                ""
              )
              .replace(/,\s*,/g, ",")
              .replace(/{\s*,/g, "{")
              .replace(/,\s*}/g, "}")
              .replace(/{\s*}/g, "{}");

            return updatedMatch;
          }

          if (match.includes("{")) {
            const updatedMatch = match
              .replace(
                new RegExp(
                  `\\s*\\b(?:${imp}(?:\\s+as\\s+\\w+)?|\\w+\\s+as\\s+${imp})\\b\\s*,?|,?\\s*\\b(?:${imp}(?:\\s+as\\s+\\w+)?|\\w+\\s+as\\s+${imp})\\b\\s*`,
                  "g"
                ),
                ""
              )
              .replace(/,\s*,/g, ",")
              .replace(/{\s*,/g, "{")
              .replace(/,\s*}/g, "}")
              .replace(/{\s*}/g, "{}");

            return updatedMatch.includes("{}") && !updatedMatch.includes(",")
              ? ""
              : updatedMatch;
          }

          if (match.includes("require")) {
            return "";
          }

          return "";
        });
      });
    });

    content = content
      .replace(/import\s*{\s*}\s*from\s*['"][^'"]+['"];?\s*/g, "")
      .replace(/import\s*,\s*{/g, "import {")
      .replace(/require\s*\(\s*['"][^'"]+['"]\s*\);?\s*/g, "")
      .replace(/\n\s*\n\s*\n/g, "\n\n")
      .trim();

    writeFileSync(file, content, "utf-8");
  });
}

export { refactorImports };
