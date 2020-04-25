import { ANTLRInputStream, CommonTokenStream } from "antlr4ts";
import { ChunkSequence } from "../ast/SyntaxTree";
import { BindingLanguageLexer } from "./generated/BindingLanguageLexer";
import { BindingLanguageParser } from "./generated/BindingLanguageParser";
import { ChunkSequenceVisitor } from "../parse2ast/ChunkSequenceVisitor";

export function parse(input: string): ChunkSequence {
  const inputStream = new ANTLRInputStream(input);
  const lexer = new BindingLanguageLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new BindingLanguageParser(tokenStream);
  const tree = parser.chunks();
  const visitor = new ChunkSequenceVisitor();
  return visitor.visit(tree);
}