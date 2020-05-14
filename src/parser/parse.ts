import { ANTLRInputStream, CommonTokenStream, ANTLRErrorListener, Token } from "antlr4ts";
import { BindingLanguageLexer } from "./generated/BindingLanguageLexer";
import { BindingLanguageParser } from "./generated/BindingLanguageParser";
import { ChunkSequenceVisitor } from "../parse2ast/ChunkSequenceVisitor";
import { AggregateError } from "../errors/AggregateError";
import { ExtendedChunk } from "../ast/SyntaxTree";
import { LocatableExtension } from "../ast/TokenExtensions";
import { SyntaxError, LocationKind, Location } from "../errors/SyntaxError";

export function parse(input: string) {
  let errors: SyntaxError[] = [];
  const errorListener: ANTLRErrorListener<Token> = {
    syntaxError(_recognizer, _offendingSymbol, _line, _positionInLine, _message, e) {
      let error: SyntaxError;
      let match;
      const charIndex = (_recognizer as any)._tokenStartCharIndex as number;
      const location: Location = _offendingSymbol != null
        ? {
          kind: LocationKind.Token,
          start: _offendingSymbol as unknown as Token,
          stop: _offendingSymbol as unknown as Token
        } : {
          kind: LocationKind.Offset,
          start: charIndex,
          stop: charIndex + 1
        };
      if (e instanceof SyntaxError) {
        error = e;
      } else if ((match = /missing (.+) at (.+)/i.exec(_message)) != null) {
        // eslint-disable-next-line no-template-curly-in-string
        error = new SyntaxError("ErrorMessage_MissingTokenAtToken", "Missing ${tokenName} at ${position}.", {
          tokenName: match[1],
          position: match[2]
        }, location);
      } else if ((match = /mismatched input (.+) expecting (.+)/i.exec(_message)) != null) {
        // eslint-disable-next-line no-template-curly-in-string
        error = new SyntaxError("ErrorMessage_MismatchedInputTokenExpectingTokens", "Mismatched input ${actual} expecting ${expected}.", {
          expected: match[2],
          actual: match[1]
        }, location);
      } else if ((match = /token recognition error at: (.+)/i.exec(_message)) != null) {
        // eslint-disable-next-line no-template-curly-in-string
        error = new SyntaxError("ErrorMessage_IllegalInput", "Could not recognize input at ${character}.", {
          character: match[1]
        }, location);
      } else if ((match = /extraneous input (.*) expecting (.*)/i.exec(_message)) != null) {
        // eslint-disable-next-line no-template-curly-in-string
        error = new SyntaxError("ErrorMessage_ExtraneousInput", "Extraneous input ${extra} expecting ${expected}.", {
          extra: match[1],
          expected: match[2]
        }, location);
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
  const tokens = lexer.getAllTokens().map((tk, index) => ({
    ...tk,
    text: tk.text,
    type: tk.type,
    tokenIndex: index
  }));
  const lexerErrors = errors;

  errors = [];
  lexer.reset();
  const parser = new BindingLanguageParser(tokenStream);
  parser.removeErrorListeners();
  parser.addErrorListener(errorListener);
  const tree = parser.chunks();
  const parserErrors = errors;

  const visitor = new ChunkSequenceVisitor();
  const hasAnyErrors = lexerErrors.length > 0 || parserErrors.length > 0;
  const model = hasAnyErrors ? null : visitor.visit(tree);

  return {
    tokens,
    lexerErrors,
    tree,
    parserErrors,
    model,
    errors
  };
}

export function compile(input: string): ExtendedChunk<LocatableExtension>[] {
  const { model, errors } = parse(input);

  if (errors.length > 0) {
    if (errors.length === 1)
      throw errors[0];
    else
      throw new AggregateError(errors);
  }

  return model!;
}