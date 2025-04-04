import * as typescript from "./typescript";
import * as casing from "case";
import { ProcessRecord } from "./typescript/processRecord";

describe("Typescript Linter", () => {
  let linter: typescript.Linter;

  beforeEach(() => {
    linter = new typescript.Linter((node, visited) => {
      const sourceFile = node.getSourceFile();
      const kind = typescript.typescript.tokenToString(node.kind);
      if (typescript.typescript.isVariableDeclaration(node)) {
        const text = node.name.getText(sourceFile);
        if (!text) {
          return;
        }
        const icase = casing.of(text);
        if (icase !== "camel") {
          return [
            {
              file: sourceFile,
              start: node.getStart(),
              length: node.getWidth(),
              messageText: "Variable name should be camelCase.",
              source: "typescript-linter",
              category: typescript.typescript.DiagnosticCategory.Error,
              code: 9000,
            },
          ];
        }
      }
    });
  });

  test("should report an error for snake_case variable names", () => {
    const source = `
      const myVariable = 10;
      const my_variable = 20; // This should trigger a linting error
    `;

    const sourceFile = typescript.typescript.createSourceFile(
      "example.ts",
      source,
      typescript.typescript.ScriptTarget.Latest,
      true
    );

    const diagnostics = linter.lint(sourceFile, new ProcessRecord());

    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].messageText).toBe(
      "Variable name should be camelCase."
    );
    expect(diagnostics[0].code).toBe(9000);
  });

  test("should not report an error for camelCase variable names", () => {
    const source = `
      const camelCaseVar = 30;
    `;

    const sourceFile = typescript.typescript.createSourceFile(
      "example.ts",
      source,
      typescript.typescript.ScriptTarget.Latest,
      true
    );

    const diagnostics = linter.lint(sourceFile, new ProcessRecord());

    expect(diagnostics).toHaveLength(0);
  });
});
