import { ExpressionKind } from "./ExpressionKind";

export interface Position {
  offset: number;
  line: number;
  columnInLine: number;
}

export interface Range {
  start: Position;
  end: Position;
}

export type LocatableBindingExpression
  = LocatableStringLiteral
  | LocatableNumberLiteral
  | LocatableBooleanLiteral
  | LocatableNullLiteral
  | LocatableIdentifier
  | LocatablePropertyAccess
  | LocatableFunctionCall
  | LocatableUnitAnnotation
  ;

export interface LocatableExpression {
  kind: ExpressionKind;
  locationSelf: Range;
}

export interface LocatableStringLiteral extends LocatableExpression {
  kind: ExpressionKind.String;
}

export interface LocatableNumberLiteral extends LocatableExpression {
  kind: ExpressionKind.Number;
}

export interface LocatableBooleanLiteral extends LocatableExpression {
  kind: ExpressionKind.Boolean;
}

export interface LocatableNullLiteral extends LocatableExpression {
  kind: ExpressionKind.Null;
}

export interface LocatableIdentifier extends LocatableExpression {
  kind: ExpressionKind.Identifier;
}

export interface LocatablePropertyAccess extends LocatableExpression {
  kind: ExpressionKind.PropertyAccess;
  locationDot: Range;
  locationId: Range;
  locationValue: Range;
}

export interface LocatableFunctionCall extends LocatableExpression {
  kind: ExpressionKind.FunctionCall;
  locationLeftParenthesis: Range;
  locationRightParenthesis: Range;
  locationActualParameters: Range[];
  locationValue: Range;
}

export interface LocatableUnitAnnotation extends LocatableExpression {
  kind: ExpressionKind.UnitAnnotation;
  locationUnit: Range;
  locationValue: Range;
}