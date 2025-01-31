# Minports

> [!WARNING]
> #### This project is still in development and should therefore not be used in production.

[![npm version](https://badge.fury.io/js/minports.svg)](https://badge.fury.io/js/minports)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Minports is a CLI tool that quickly scans your project for unused imports and helps clean up unnecessary dependencies listed in your `package.json`. It assists developers in maintaining cleaner codebases by identifying and optionally removing unused imports, as well as pointing out unneeded dependencies.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Command-Line Options](#command-line-options)
  - [Examples](#examples)
- [How It Works](#how-it-works)
- [Bugs](#bugs)
- [License](#license)

---

## Features

- **Scan for Unused Imports**: Quickly find unused import statements across your project.
- **Automatic Refactoring**: Optionally refactor code to remove the detected unused imports.
- **Dependency Optimization**: Identify unused dependencies in your `package.json` file.
- **Verbose Logging**: Detailed logs for troubleshooting and analysis.

---

## Installation

Install Minports globally using npm:

```bash
npm install -g minports
```

Alternatively, you can use npx to run Minports without installing globally:

```bash
npx minports [options]
```

---

## Usage

Run Minports from the command line to scan your project and optimize your imports and dependencies.

```bash
minports [options]
```

### Command-Line Options

- `-p, --path <path>`: Specify the path to the project directory. Defaults to the current directory (`.`).
- `-r, --refactor`: Automatically refactor your code by removing unused imports.
- `-v, --verbose`: Enable verbose logging for more detailed output in case something goes wrong.
- `-V, --version`: Output the version number.
- `-h, --help`: Display help for command.

### Examples

1. **Basic Scan**: Scan the current directory for unused imports and dependencies.

   ```bash
   minports
   ```

2. **Specify Project Path**: Scan a specific directory, e.g., `./src`.

   ```bash
   minports --path ./src
   ```

3. **Refactor Imports Automatically**: Scan and automatically remove unused imports.

   ```bash
   minports --refactor
   ```

4. **Verbose Logging**: Scan with detailed logging enabled.

   ```bash
   minports --verbose
   ```

5. **Combined Options**: Scan a specific path, remove unused imports, and enable verbose logging.

   ```bash
   minports --path ./src --refactor --verbose
   ```

---

## How It Works

Minports leverages [Commander.js](https://github.com/tj/commander.js/) for CLI option parsing and [Chalk](https://github.com/chalk/chalk) for colored terminal output. The process follows these steps:

1. **Initialization**: The program parses CLI arguments to determine the project path, whether to refactor, and if verbose logging is enabled.
2. **Scanning**: 
   - It initiates a scan of the provided project directory looking for unused import statements in the code.
   - The tool also checks the project's `package.json` for dependencies that are not used in the codebase.
3. **Reporting**:
   - Lists files and specific imports that are unused.
   - Displays unused packages from `package.json`.
4. **Refactoring** (optional):
   - If the `--refactor` flag is provided and unused imports are found, it will automatically remove those imports from the code files.
5. **Output**:
   - Provides colored output to enhance readability of the scan results.
   - Reports success messages or errors based on the outcome of each step.

The core logic for analysis and refactoring is implemented in separate modules, ensuring the code is organized and maintainable.

---

## Bugs

If you encounter any bugs or unexpected behavior while using Minports, please let us know:

1. **Report an Issue**: Open an issue in the [GitHub repository](https://github.com/Matteo-Code/minports/issues) and provide as much detail as possible:
   - Steps to reproduce the bug.
   - Screenshots or error logs (if available).
   - Version of Minports and Node.js you are using.
2. **Contribute a Fix**: If you're comfortable contributing a fix, feel free to fork the repository, create a branch for your bugfix, and submit a pull request.

---

## License

This project is licensed under the MIT License.

--- 
