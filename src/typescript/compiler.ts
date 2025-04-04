import { SourceFile } from "typescript";
import { TypescriptSource } from "./source";

export type TranspilationSteps = (sourceFile: SourceFile) => SourceFile;

export class TypescriptCompiler {
  constructor(
    private transpilationSteps: TranspilationSteps[],
    private tss: TypescriptSource
  ) {
    /** ... */
  }

  private preTranspile(sourceFile: SourceFile): SourceFile {
    let emit = sourceFile;

    for (const transpilationStep of this.transpilationSteps) {
      const transpilationResult = transpilationStep(sourceFile);
      emit = this.tss.createSourceFile(
        transpilationResult.fileName,
        transpilationResult
      );
    }

    return emit;
  }

  compile(sourceFile: SourceFile): string {
    return this.tss.emit(this.preTranspile(sourceFile));
  }
}
