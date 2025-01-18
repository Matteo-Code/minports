import { readFileSync } from "fs";
import { join } from "path";

async function getPackages() {
  const path = join(process.cwd(), "package.json");

  const packageJson = JSON.parse(readFileSync(path, "utf-8"));

  const dependencies = packageJson.dependencies || {};
  // const devDependencies = packageJson.devDependencies || {};

  const packages = new Set();

  //   console.log("📦 Dependencies:");
  Object.keys(dependencies).forEach((pkg) => {
    // console.log(`- ${pkg}: ${dependencies[pkg]}`);
    packages.add(pkg);
  });

  //   console.log("\n🛠 Dev Dependencies:");
  //   Object.keys(devDependencies).forEach((pkg) => {
  //     console.log(`- ${pkg}: ${devDependencies[pkg]}`);
  //   });
  return packages;
}

export { getPackages };
