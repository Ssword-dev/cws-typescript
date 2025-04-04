import typescript from "typescript";
import { ProcessRecord } from "./processRecord";

export type Transformer = (node: typescript.Node) => typescript.Node | undefined;
export type Linter = (node: typescript.Node, visited: ProcessRecord) => typescript.Diagnostic[] | undefined;
export type EmissionResult = string;
export type Compiler = (node: typescript.Node) => EmissionResult | undefined;