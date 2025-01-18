import { analyzeProject } from "../src/analyze.js";
import { join } from "path";

describe("analyzeProject", () => {
  it("should find unused imports in a test fixture project", async () => {
    const fixturePath = join("tests", "fixtures");
    const report = await analyzeProject(fixturePath);

    expect(report.imports).toHaveLength(1);
    expect(report.packages).toContain("chalk");
  });
});
