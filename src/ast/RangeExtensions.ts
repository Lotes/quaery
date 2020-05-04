import { ExpressionKind } from "./ExpressionKind";

export interface Range {
  startIndex: number;
  stopIndex: number;
}

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
  locationSelf: Range;
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
  locationDot: Range;
  locationId: Range;
  locationValue?: Range;
}

export interface LocatableFunctionCall extends LocatableExtensionBase {
  kind: ExpressionKind.FunctionCall;
  locationLeftParenthesis: Range;
  locationRightParenthesis: Range;
  locationActualParameters: Range[];
  locationValue?: Range;
}

export interface LocatableUnitAnnotation extends LocatableExtensionBase {
  kind: ExpressionKind.UnitAnnotation;
  locationUnit: Range;
  locationValue: Range;
}