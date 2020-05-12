import { ANTLRInputStream, CommonTokenStream, ANTLRErrorListener, Token, RecognitionException } from "antlr4ts";
import { BindingLanguageLexer } from "./generated/BindingLanguageLexer";
import { BindingLanguageParser } from "./generated/BindingLanguageParser";
import { ChunkSequenceVisitor } from "../parse2ast/ChunkSequenceVisitor";
import { AggregateError } from "../errors/AggregateError";
import { Chunk } from "../ast/SyntaxTree";
import { LocatableExtension } from "../ast/RangeExtensions";
import { SyntaxError } from "../errors/SyntaxError";
import { newRangeFromTokens } from "../ast/factory";

export function createParsingEnvironmentFor(input: string) {
  const errors: Error[] = [];
  const errorListener: ANTLRErrorListener<Token> = {
    syntaxError(_recognizer, _offendingSymbol, _line, _positionInLine, _message, e) {
      let error: Error;
      let match;
      if (e instanceof SyntaxError) {
        error = e;
      } else if ((match = /missing (.+) at (.+)/i.exec(_message)) != null) {
        // eslint-disable-next-line no-template-curly-in-string
        error = new SyntaxError("ErrorMessage_MissingTokenAtToken", "Missing ${tokenName} at ${position}.", {
          tokenName: match[1],
          position: match[2]
        }, newRangeFromTokens(_offendingSymbol as unknown as Token));
      } else if ((match = /mismatched input (.+) expecting (.+)/i.exec(_message)) != null) {
        // eslint-disable-next-line no-template-curly-in-string
        error = new SyntaxError("ErrorMessage_MismatchedInputTokenExpectingTokens", "Mismatched input ${actual} expecting ${expected}.", {
          expected: match[2],
          actual: match[1]
        }, newRangeFromTokens(_offendingSymbol as unknown as Token));
      } else if ((match = /token recognition error at: (.+)/i.exec(_message)) != null) {
        const startIndex = (_recognizer as any)._tokenStartCharIndex as number;
        // eslint-disable-next-line no-template-curly-in-string
        error = new SyntaxError("ErrorMessage_IllegalInput", "Could not recognize input at ${character}.", {
          character: match[1]
        }, {
          startIndex,
          stopIndex: startIndex + 1
        });
      } else if ((match = /extraneous input (.*) expecting (.*)/i.exec(_message)) != null) {
        const startIndex = (_recognizer as any)._tokenStartCharIndex as number;
        // eslint-disable-next-line no-template-curly-in-string
        error = new SyntaxError("ErrorMessage_ExtraneousInput", "Extraneous input ${extra} expecting ${expected}.", {
          extra: match[1],
          expected: match[2]
        }, {
          startIndex,
          stopIndex: startIndex + 1
        });
      } else {
        throw new Error("UNIMPLEMENTED ERROR: " + _message);
      }
      errors.push(error);
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

  return {
    lexer,
    parser,
    errors
  };
}

export function parse(input: string): Chunk<LocatableExtension>[] {
  const { parser, errors } = createParsingEnvironmentFor(input);

  if (errors.length > 0) {
    if (errors.length === 1)
      throw errors[0];
    else
      throw new AggregateError(errors);
  }

  const tree = parser.chunks();
  const visitor = new ChunkSequenceVisitor();
  return visitor.visit(tree);
}