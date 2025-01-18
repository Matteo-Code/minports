import { readFileSync, writeFileSync } from 'fs';

function refactorImports(report) {
  report.forEach(({ file, unused }) => {
    let content = readFileSync(file, 'utf-8');

    unused.forEach((imp) => {
      const importRegex = new RegExp(`import\\s+\\{?\\s*${imp}\\s*\\}?\\s+from\\s+['"].+['"];?`, 'g');
      content = content.replace(importRegex, '');
    });

    writeFileSync(file, content, 'utf-8');
  });
}

export { refactorImports };
