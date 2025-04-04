import typescript from "typescript";

export class TypescriptSource {
	// A printer is used to print the AST nodes to a string
	// It is used to convert the AST nodes to a string representation of the source code
	private printer: typescript.Printer;
	// This is an implementation of a dynamic source file for TypeScript
	// It allows for dynamic updates to the source file content and structure
	// Dynamically, can be used to chain recompilation or relinting
	constructor(printerOpts: typescript.PrinterOptions = {}) {
		// Create a printer with the given options
		this.printer = typescript.createPrinter(printerOpts);
	}

	// This function creates a dynamic source file for TypeScript
	// It takes a file name and an `nodes`
	// and returns a source file with the given name and nodes
	// This is used to create a source file for the TypeScript compiler API
	// The nodes are the actual AST nodes that make up the source file
	// The file name is used to identify the source file (passed to the TypeScript API)

	createSourceFile(fileName: string, root: typescript.Node): typescript.SourceFile {
		// Create a new source file with the given name and nodes
		// This is used to create a source file for the TypeScript compiler API
		// The nodes are the actual AST nodes that make up the source file
		// The file name is used to identify the source file (passed to the TypeScript API)

		if (!root.getChildren) {
			throw new Error("Root node is not convertible to a source file");
		}
		const emit = this.emit(root);
		return typescript.createSourceFile(fileName, emit, typescript.ScriptTarget.Latest, true, typescript.ScriptKind.TS);
	}

	emit(root: typescript.Node): string {
		let emit: string;

		if (typescript.isSourceFile(root)) {
			emit = this.printer.printFile(root);
		}
		else if (typescript.isBundle(root)) {
			emit = this.printer.printBundle(root);
		}
		else {
			emit = this.printer.printNode(typescript.EmitHint.Unspecified, root, root.getSourceFile());
		}

		return emit;
	}
}