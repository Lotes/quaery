import { BindingLanguageLexer } from "./generated/BindingLanguageLexer";

export enum TokenNames {
  LMUSTACHE = "LMUSTACHE",
  TEXT = "TEXT",
  UNIT = "UNIT",
  TRUE = "TRUE",
  FALSE = "FALSE",
  NULL = "NULL",
  STRING = "STRING",
  RMUSTACHE = "RMUSTACHE",
  LPAREN = "LPAREN",
  RPAREN = "RPAREN",
  DOT = "DOT",
  ID = "ID",
  NUMBER = "NUMBER",
  COMMA = "COMMA",
  WS = "WS",
  UNKNOWN = "UNKNOWN"
}

export function getTokenName(tokenType: number): string {
  switch (tokenType) {
    case BindingLanguageLexer.LMUSTACHE: return TokenNames.LMUSTACHE;
    case BindingLanguageLexer.TEXT: return TokenNames.TEXT;
    case BindingLanguageLexer.UNIT: return TokenNames.UNIT;
    case BindingLanguageLexer.TRUE: return TokenNames.TRUE;
    case BindingLanguageLexer.FALSE: return TokenNames.FALSE;
    case BindingLanguageLexer.NULL: return TokenNames.NULL;
    case BindingLanguageLexer.STRING: return TokenNames.STRING;
    case BindingLanguageLexer.RMUSTACHE: return TokenNames.RMUSTACHE;
    case BindingLanguageLexer.LPAREN: return TokenNames.LPAREN;
    case BindingLanguageLexer.RPAREN: return TokenNames.RPAREN;
    case BindingLanguageLexer.DOT: return TokenNames.DOT;
    case BindingLanguageLexer.ID: return TokenNames.ID;
    case BindingLanguageLexer.NUMBER: return TokenNames.NUMBER;
    case BindingLanguageLexer.COMMA: return TokenNames.COMMA;
    case BindingLanguageLexer.WS: return TokenNames.WS;
    case BindingLanguageLexer.UNKNOWN: return TokenNames.UNKNOWN;
    default:
      throw new Error("Unknown token type: " + tokenType);
  }
}