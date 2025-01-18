import { execSync } from 'child_process';
import {join} from 'path';

describe('CLI', () => {
  it('should run the analyze command successfully', () => {
    const cliPath = join('index.js');
    const fixturePath = join('tests', 'fixtures');

    const output = execSync(`node ${cliPath} --path ${fixturePath}`, {
      encoding: 'utf-8',
    });

    expect(output).toMatch(/Scanning for unused imports/);
    expect(output).toMatch(/Unused Imports Found/);
  });
});
