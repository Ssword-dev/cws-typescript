import { Linter, typescript } from "./typescript";
import {
  PluginHost,
  TranspilerPlugin,
  LinterPlugin,
} from "./typescript/plugins";
import { TypescriptSource } from "./typescript/source";

describe("PluginHost", () => {
  const pluginHost = new PluginHost();

  const linter = new Linter((node, _) => {
    const source = node.getSourceFile();
    if (
      typescript.isVariableStatement(node) &&
      (node.flags & typescript.NodeFlags.None) === 0
    ) {
      return [
        {
          category: typescript.DiagnosticCategory.Error,
          code: 9001,
          messageText:
            "Var declarations are not reccomended, go use let instead!",

          source: source.fileName,
          start: node.getStart(source),
          length: node.getWidth(source),
          file: source,
        },
      ];
    }
    return undefined;
  });

  const linterPlugin = new LinterPlugin(linter);
  pluginHost.addPlugin(linterPlugin);

  const source = `
  var test = 0;
  `;

  const sourceFile = typescript.createSourceFile(
    "t3.es.ts",
    source,
    typescript.ScriptTarget.Latest
  );
  it("should return no diagnostic", () => {
    const tss = new TypescriptSource({
      newLine: typescript.NewLineKind.LineFeed,
    });

    expect(
      pluginHost.lint(tss.createSourceFile("example.ts", sourceFile))
    ).toEqual([
      {
        category: 1,
        code: 9001,
        length: 13,
        messageText:
          "Var declarations are not reccomended, go use let instead!",
        source: "example.ts",
        start: 0,
        file: sourceFile,
      },
    ]);
  });
});
