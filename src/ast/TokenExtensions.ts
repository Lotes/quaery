import { ExpressionKind } from "./ExpressionKind";
import { Token } from "antlr4ts";

export type LocatableExtension
  = LocatableStringLiteral
  | LocatableNumberLiteral
  | LocatableBooleanLiteral
  | LocatableNullLiteral
  | LocatableIdentifier
  | LocatablePropertyAccess
  | LocatableFunctionCall
  | LocatableUnitAnnotation
  ;

export interface LocatableExtensionBase {
  kind: ExpressionKind;
  tokenStart: Token;
  tokenStop: Token;
}

export interface LocatableStringLiteral extends LocatableExtensionBase {
  kind: ExpressionKind.String;
}

export interface LocatableNumberLiteral extends LocatableExtensionBase {
  kind: ExpressionKind.Number;
}

export interface LocatableBooleanLiteral extends LocatableExtensionBase {
  kind: ExpressionKind.Boolean;
}

export interface LocatableNullLiteral extends LocatableExtensionBase {
  kind: ExpressionKind.Null;
}

export interface LocatableIdentifier extends LocatableExtensionBase {
  kind: ExpressionKind.Identifier;
}

export interface LocatablePropertyAccess extends LocatableExtensionBase {
  kind: ExpressionKind.PropertyAccess;
  tokenDot: Token;
  tokenId: Token;
}

export interface LocatableFunctionCall extends LocatableExtensionBase {
  kind: ExpressionKind.FunctionCall;
  tokenLeftParenthesis: Token;
  tokenRightParenthesis: Token;
  tokenCommas: Token[];
}

export interface LocatableUnitAnnotation extends LocatableExtensionBase {
  kind: ExpressionKind.UnitAnnotation;
  tokenUnit: Token;
}