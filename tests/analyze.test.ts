import { analyzeFile, analyzeProject } from "../src/analyze";
import { refactorImports } from "../src/refactor";
import { setLoggingEnabled } from "../src/config";
import fs from "fs";

jest.mock("fs");
jest.mock("../src/packages", () => ({
  getPackages: jest
    .fn()
    .mockResolvedValue(new Set(["module1", "module2", "module3"])),
}));

const mockedFs = fs as jest.Mocked<typeof fs>;

mockedFs.readFileSync.mockImplementation((filePath) => {
  let file = filePath as string;
  if (file.includes("package.json")) {
    return JSON.stringify({
      dependencies: {
        module1: "^1.0.0",
        module2: "^2.0.0",
        module3: "^3.0.0",
      },
    });
  }
  return "";
});

describe("anaylzeFile", () => {
  it("should detect unused imports in file", async () => {
    const mockFile = "test-file.ts";
    const mockContent = `
    import { unused, used } from './module';
    
    console.log(used);
    `

    mockedFs.readFileSync.mockReturnValue(mockContent);
    const result = await analyzeFile(mockFile);

    expect(result).toEqual({
      file: "test-file.ts",
      unused: ["unused"],
    });
  });
});

describe("refactorImports", () => {
  it("should remove unused imports from files", () => {
    const mockFile = "test-file.ts";
    const mockContent = `
      import { unused, used } from './module';

      console.log(used);
    `;

    mockedFs.readFileSync.mockReturnValue(mockContent);

    const mockWriteFileSync = jest.fn();
    mockedFs.writeFileSync = mockWriteFileSync;

    refactorImports([{ file: mockFile, unused: ["unused"] }]);

    expect(mockWriteFileSync).toHaveBeenCalledWith(
      mockFile,
      `
      import { used } from './module';

      console.log(used);
      `.trim(),
      "utf-8"
    );
  });
});

describe("setLoggingEnabled", () => {
  it("should toggle logging correctly", () => {
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    setLoggingEnabled(true);
    expect(consoleLogSpy).not.toHaveBeenCalled();

    setLoggingEnabled(false);
    expect(consoleLogSpy).not.toHaveBeenCalled();

    consoleLogSpy.mockRestore();
  });
});
