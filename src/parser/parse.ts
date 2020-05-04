import { ANTLRInputStream, CommonTokenStream, ANTLRErrorListener, Token, RecognitionException } from "antlr4ts";
import { BindingLanguageLexer } from "./generated/BindingLanguageLexer";
import { BindingLanguageParser } from "./generated/BindingLanguageParser";
import { ChunkSequenceVisitor } from "../parse2ast/ChunkSequenceVisitor";
import { AggregateError } from "../AggregateError";
import { Chunk } from "../ast/SyntaxTree";

export function parse(input: string): Chunk<{}>[] {
  const errors: RecognitionException[] = [];
  const errorListener: ANTLRErrorListener<Token> = {
    syntaxError(_recognizer, _offendingSymbol, _line, _positionInLine, _message, e) {
      errors.push(e!);
    }
  };

  const inputStream = new ANTLRInputStream(input);
  const lexer = new BindingLanguageLexer(inputStream);
  lexer.removeErrorListeners();
  lexer.addErrorListener(errorListener);
  const tokenStream = new CommonTokenStream(lexer);

  const parser = new BindingLanguageParser(tokenStream);
  parser.removeErrorListeners();
  parser.addErrorListener(errorListener);
  const tree = parser.chunks();


  if (errors.length > 0) {
    throw new AggregateError(errors);
  }

  const visitor = new ChunkSequenceVisitor();
  return visitor.visit(tree);
}