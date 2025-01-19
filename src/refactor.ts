import { readFileSync, writeFileSync } from 'fs';
import { UnusedImport } from './types/report';

function refactorImports(report:UnusedImport[]) {  
  report.forEach(({ file, unused }) => {
    let content = readFileSync(file, 'utf-8');
    unused.forEach((imp) => {
      const importRegex = new RegExp(
        `import\\s+(?:(?:\\{[^}]*\\b${imp}\\b[^}]*\\})|(?:[^,]*\\b${imp}\\b[^,]*))\\s+from\\s+['"].+['"];?`, 
        'g'
      );
      content = content.replace(importRegex, (match) => {
        if (match.includes('{')) {
          const updatedMatch = match.replace(new RegExp(`\\b${imp}\\b\\s*,\\s*|,?\\s*\\b${imp}\\b`, 'g'), '')
                                    .replace(/\{\s*,\s*\}/, '{}');
          return updatedMatch.includes('{}') ? '' : updatedMatch;
        }
        return '';
      });
    });
    content = content.replace(/import\s+\{\s*\}\s+from\s+['"].+['"];?/g, '');

    writeFileSync(file, content, 'utf-8');
  });
}

export { refactorImports };