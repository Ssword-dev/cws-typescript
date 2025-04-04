
import typescript from "typescript";

// This function creates a custom token for the TypeScript AST
// It takes a token type as an argument and returns a typed token node
export function createToken
    <Ttype extends AbstractSyntaxTreeTokenType>(
        type: Ttype
    ): AbstractSyntaxTreeToken<Ttype["name"], Ttype["factory"]> {
    const token = typescript.factory.createToken(typescript.SyntaxKind.Unknown) as AbstractSyntaxTreeToken<Ttype["name"], Ttype["factory"]>;
    token.type = type;
    return token;
}

// This function creates a custom token type for the TypeScript AST token
// It takes a name and a factory function as arguments and returns a token type
export function createTokenType<Tname extends string, Tfactory extends AbstractSyntaxTreeTokenFactory>(
    name: Tname,
    factory: Tfactory
): AbstractSyntaxTreeTokenType<Tname, Tfactory> {
    if (!factory.name.includes(name)) {
        throw new Error(`Factory name does not include token name: ${name} (Identity Error)`);
    }
    // Create a token type with the given name and factory
    // This is used to create a custom token type for the TypeScript AST
    // The factory function is used to create the actual token node
    // The name is used to identify the token type

    return { name, factory };
}

// This function checks if the given node is a custom token
// It takes a node as an argument and returns true if the node is a custom token
// and false otherwise
export function isCustomToken(node: typescript.Node): node is AbstractSyntaxTreeToken {
    // Check if the node is a custom token by checking if it has a type property
    return (node as AbstractSyntaxTreeToken).type !== undefined;
}

// This function checks if the given node is a custom typed token
// It takes a node and a token type as arguments and returns true if the node is a custom typed token
export function isCustomTypedToken<Tname extends string, Tfactory extends AbstractSyntaxTreeTokenFactory>(
    node: typescript.Node,
    type: AbstractSyntaxTreeTokenType<Tname, Tfactory>
): node is AbstractSyntaxTreeToken<Tname, Tfactory> {
    // Check if the node is a custom token of the given type by checking if it has a type property
    return (node as AbstractSyntaxTreeToken).type === type;
}

// A custom AST node factory for creating the actual AST nodes
export type AbstractSyntaxTreeTokenFactory = (...args: any[]) => typescript.Node;

// A custom AST node type that represents a unique identifier for the token
export interface AbstractSyntaxTreeTokenType
    <
        Tname extends string = string,
        Tfactory extends AbstractSyntaxTreeTokenFactory = AbstractSyntaxTreeTokenFactory
    > {
    /** Unique identifier for the token */
    name: Tname,
    factory: Tfactory
}

// A custom AST node that extends the TypeScript Node interface
// and adds a unique identifier for the token type
// This allows us to create a custom AST node that can be used in the TypeScript compiler API
export interface AbstractSyntaxTreeToken
    <
        Tname extends string = string,
        Tfactory extends AbstractSyntaxTreeTokenFactory = AbstractSyntaxTreeTokenFactory
    > extends typescript.Node {
    kind: typescript.SyntaxKind.Unknown;
    type: AbstractSyntaxTreeTokenType<Tname, Tfactory>;
}
