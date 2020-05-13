import { NodeKind } from "./NodeKind";
import { Token } from "antlr4ts";

export type LocatableExtension
  = LocatableTextChunk
  | LocatableBindingChunk
  | LocatableStringLiteral
  | LocatableNumberLiteral
  | LocatableBooleanLiteral
  | LocatableNullLiteral
  | LocatableIdentifier
  | LocatablePropertyAccess
  | LocatableFunctionCall
  | LocatableUnitAnnotation
  ;

export interface LocatableExtensionBase {
  kind: NodeKind;
  tokenStart: Token;
  tokenStop: Token;
}

export interface LocatableTextChunk extends LocatableExtensionBase {
  kind: NodeKind.TextChunk;
}

export interface LocatableBindingChunk extends LocatableExtensionBase {
  kind: NodeKind.BindingChunk;
  tokenLeftMustache: Token;
  tokenRightMustache: Token;
}

export interface LocatableStringLiteral extends LocatableExtensionBase {
  kind: NodeKind.String;
}

export interface LocatableNumberLiteral extends LocatableExtensionBase {
  kind: NodeKind.Number;
}

export interface LocatableBooleanLiteral extends LocatableExtensionBase {
  kind: NodeKind.Boolean;
}

export interface LocatableNullLiteral extends LocatableExtensionBase {
  kind: NodeKind.Null;
}

export interface LocatableIdentifier extends LocatableExtensionBase {
  kind: NodeKind.Identifier;
}

export interface LocatablePropertyAccess extends LocatableExtensionBase {
  kind: NodeKind.PropertyAccess;
  tokenDot: Token;
  tokenId: Token;
}

export interface LocatableFunctionCall extends LocatableExtensionBase {
  kind: NodeKind.FunctionCall;
  tokenLeftParenthesis: Token;
  tokenRightParenthesis: Token;
  tokenCommas: Token[];
}

export interface LocatableUnitAnnotation extends LocatableExtensionBase {
  kind: NodeKind.UnitAnnotation;
  tokenUnit: Token;
}