import typescript from 'typescript';

export class ProcessRecord {
	/** @__CLASS_FACTORY__ */
	static createProcessRecord = (...args: ConstructorParameters<typeof ProcessRecord>) =>
		new ProcessRecord(...args);

	/** @internal */
	constructor(
		/** A record of all visited nodes */
		private items: Set<typescript.Node> = new Set()
	) { }

	/**
	 * @category Process Record
	 * @description Adds a node to the record of visited nodes.
	 * @param {T} node - The node to be added to the record.
	 * @returns {void}
	 */
	add(node: typescript.Node): void {
		if (!node) throw new Error("Node is undefined");
		this.items.add(node);  // Set automatically prevents duplicates
	}

	/**
	 * @category Process Record
	 * @description Removes a node from the record of visited nodes.
	 * @param {T} node - The node to be removed from the record.
	 */
	remove(node: typescript.Node): void {
		if (!node) throw new Error("Node is undefined");
		this.items.delete(node);  // More efficient removal from Set
	}

	/**
	 * @category Process Record
	 * @description Checks if the value is present
	 * @param {T} value
	 */
	has(value: typescript.Node){
		return this.items.has(value);
	}
	/**
	 * @category Process Record
	 * @description Returns the record of visited nodes.
	 * @returns {T[]} An array of visited nodes.
	 */
	get(): typescript.Node[] {
		return Array.from(this.items);  // Convert Set to array for easier use
	}

	/**
	 * @category Process Record
	 * @description Clears the record of visited nodes.
	 * @returns {void}
	 */
	clear(): void {
		this.items.clear();  // Efficiently clears a Set
	}
}
