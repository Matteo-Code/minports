import { readFileSync } from "fs";
import { join } from "path";

async function getPackages():Promise<Set<string>> {
  const path = join(process.cwd(), "package.json");

  const packageJson = JSON.parse(readFileSync(path, "utf-8"));

  const dependencies = packageJson.dependencies || {};

  const packages = new Set<string>();

  Object.keys(dependencies).forEach((pkg) => {
    packages.add(pkg);
  });

  return packages;
}

export { getPackages };
