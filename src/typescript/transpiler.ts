import typescript from "typescript";
import type { Transformer } from "./types";


export class TypescriptTranspiler {
  /** @__CLASS_FACTORY__ */
  static createTranspiler = (...args: ConstructorParameters<typeof TypescriptTranspiler>) => new TypescriptTranspiler(...args);

  /** @internal */
  constructor(private transformer: Transformer) { }

  /** @__AUTO_TYPE__ */
  visit(node: typescript.Node, ctx: typescript.TransformationContext): typescript.Node {
    const transformed = this.transformer(node) ?? node;

    return typescript.visitEachChild(
      transformed,
      (child) => this.visit(child, ctx),
      ctx
    );
  }

  /**
   * @category Transpilation (TS -> JS/TS)
   * @description Transforms the given TypeScript AST node using the provided transformer function.
   * @param {T} root - The root node of the TypeScript AST to be transformed.
   * @returns {T} The transformed node, which is the modified root node of the transformed tree
   */
  transform<T extends typescript.Node>(root: T): T {
    if (!root) throw new Error("Root node is undefined");
    if (!this.transformer) throw new Error("Transformer is undefined");
    // Relaxes the type of the root node to allow for any node type
    // This is a workaround for the fact that TypeScript's transform function
    // expects a SourceFile, but we want to allow any node type.
    // This is intentionally unsafe, but we are using it in a controlled manner.
    // and because this.visit() requires a generic typescript.Node type
    const result = typescript.transform<typescript.Node>(root, [(ctx) => (node) => this.visit(node, ctx)]);

    // Only return the first transformed node (root)
    return result.transformed[0] as T; // <-- can sometimes be not typescript.SourceFile
  }
}


export default TypescriptTranspiler;