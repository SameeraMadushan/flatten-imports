#!/usr/bin/env node

// codemod-flatten-imports/src/index.ts
import { Command } from "commander";
import { Project } from "ts-morph";

const program = new Command();

program
  .name("flatten-imports")
  .description(
    "Codemod to replace named imports from barrel files with direct imports"
  )
  .option(
    "-p, --paths <paths>",
    "Comma-separated list of barrel directories (e.g. src/components,src/hooks)",
    "src/components"
  )
  .option("-a, --alias <alias>", "Import alias used in code (e.g. @, ~)", "@/")
  .option("--dry", "Do a dry run without writing changes", false)
  .parse(process.argv);

const options = program.opts();
const barrelDirs = options.paths.split(",").map((p) => p.trim());
const aliasPrefix = options.alias;
const dryRun = options.dry;

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
  compilerOptions: {
    allowJs: true,
    checkJs: false,
  },
});

project.addSourceFilesAtPaths(["src/**/*.{ts,tsx,js,jsx}"]);

const isTargetImport = (importPath: string): boolean => {
  return barrelDirs.some(
    (dir) =>
      importPath === `${aliasPrefix}${dir.replace(/^src\//, "")}` ||
      importPath.endsWith(`/${dir.split("/").pop()}`)
  );
};

let totalFilesTouched = 0;

project.getSourceFiles().forEach((sourceFile) => {
  let didChange = false;

  sourceFile.getImportDeclarations().forEach((decl) => {
    const spec = decl.getModuleSpecifierValue();
    if (isTargetImport(spec)) {
      const namedImports = decl.getNamedImports();
      if (namedImports.length === 0) return;

      const replacements = namedImports.map((named) => ({
        name: named.getName(),
      }));
      decl.remove();

      replacements.forEach(({ name }) => {
        sourceFile.addImportDeclaration({
          defaultImport: name,
          moduleSpecifier: `${spec}/${name}`,
        });
      });

      didChange = true;
    }
  });

  if (didChange) {
    totalFilesTouched++;
    console.log(
      `${dryRun ? "[Dry Run] " : ""}✔ Updated: ${sourceFile.getFilePath()}`
    );
    if (!dryRun) sourceFile.saveSync();
  }
});

console.log(
  `\n${dryRun ? "[Dry Run] " : ""}Done. ${totalFilesTouched} file(s) updated.`
);
