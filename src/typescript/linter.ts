import typescript from "typescript";
import type { Linter } from "./types";
import { ProcessRecord } from "./processRecord";
import {
  NoRootError,
  SyntheticNodeError,
  TypescriptLinterError,
} from "./named_errors";
// Typescript Linter

export class TypescriptLinter {
  /** @__CLASS_FACTORY__ */
  static createLinter = (
    ...args: ConstructorParameters<typeof TypescriptLinter>
  ) => new TypescriptLinter(...args);

  /** @internal */
  constructor(private linter: Linter) {}

  /**
   * @category Linting (TS -> Diagnostic)
   * @description Lints the given TypeScript AST node using the provided linter function.
   * @param {T} root - The root node of the TypeScript AST to be linted.
   * @param [ctx=new ProcessRecord()] Internal, Do not pass a ProcessRecord outside of the other internal functions,
   * visited nodes persists throughout the whole recursion
   * @returns {typescript.Diagnostic[]} An array of diagnostics, which are the linting results for the given node.
   * @throws {Error} If the root node is undefined or if the linter function is undefined.
   */
  lint(
    root: typescript.Node,
    ctx: ProcessRecord = new ProcessRecord()
  ): typescript.Diagnostic[] {
    if (!root) throw new NoRootError("Root node is undefined");
    if (!this.linter) throw new TypescriptLinterError("Linter is undefined");

    const diagnostics: typescript.Diagnostic[] = [];
    const stack: typescript.Node[] = [root];

    // Manual stack manipulation
    // [root] -> [children(root)] -> [children(children(root))] -> ... until it finishes
    while (stack.length > 0) {
      const node = stack.pop();

      if (!node || ctx.has(node)) continue; // Skip if already visited
      ctx.add(node);
      const source = node.getSourceFile();

      if (!source) {
        throw new SyntheticNodeError(
          "Synthetic nodes need to be recreated via TypescriptSource.createSourceFile()"
        );
      }
      const lintResult = this.linter(node, ctx);
      if (
        Array.isArray(lintResult) /** Confirms if lintResult is an array */ &&
        lintResult.length >
          0 /** if there is an item, or else we skip pushing */
      ) {
        diagnostics.push.apply(diagnostics, lintResult);
      }

      if (
        !node.getChildren /** is a token or getChildren not defined on node */ ||
        node.getChildCount(source) === 0 /** No Child, skip */
      ) {
        /** pass */
      } else
        stack.push.apply(stack, node.getChildren(source) as typescript.Node[]);
    }

    return diagnostics;
  }
}

export default TypescriptLinter;
