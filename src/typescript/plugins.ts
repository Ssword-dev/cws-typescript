import { Diagnostic, SourceFile } from "typescript";
import TypescriptLinter from "./linter";
import TypescriptTranspiler from "./transpiler";
import { NoRootError } from "./named_errors";

export class TranspilerPlugin {
  constructor(public transpiler: TypescriptTranspiler) {}
}

export class LinterPlugin {
  constructor(public linter: TypescriptLinter) {}
}

export type PluginType = TranspilerPlugin | LinterPlugin;
export class PluginHost {
  constructor(
    private transpilerPlugins: TranspilerPlugin[] = [],
    private linterPlugins: LinterPlugin[] = []
  ) {}

  lint(sourceFile: SourceFile) {
    const diagnostics: Diagnostic[] = [];

    for (const plugin of this.linterPlugins) {
      const result = plugin.linter.lint(sourceFile);

      if (result.length > 0) {
        diagnostics.push.apply(diagnostics, result);
      }
    }

    return diagnostics;
  }

  transpile(sourceFile: SourceFile) {
    if (!sourceFile) throw new NoRootError(`A source file must be given!`);
    let emit = sourceFile;
    for (const plugin of this.transpilerPlugins) {
      emit = plugin.transpiler.transform(emit);
    }

    return emit;
  }

  addPlugin(plugin: PluginType) {
    if (plugin instanceof TranspilerPlugin) this.transpilerPlugins.push(plugin);
    else if (plugin instanceof LinterPlugin) this.linterPlugins.push(plugin);
    else {
      throw new Error(
        `Invalid plugin type: '${(plugin as any).constructor.name}'`
      );
    }
  }

  removePlugin(plugin: PluginType) {
    let idx = -1;
    let pluginPath: PluginType[];
    if (plugin instanceof TranspilerPlugin) {
      pluginPath = this.transpilerPlugins;
    } else if (plugin instanceof LinterPlugin) {
      pluginPath = this.linterPlugins;
    } else {
      throw new Error(
        `Invalid plugin type: '${(plugin as any).constructor.name}'`
      );
    }

    idx = pluginPath.indexOf(plugin);

    if (idx < 0) {
      throw new Error(`Plugin not found`);
    }

    pluginPath.splice(idx, 1);
  }
}
