import { ExpressionKind } from "./ExpressionKind";

export enum ChunkKind {
  Text,
  Binding
}

export type Chunk<TExtension> = TextChunk | BindingChunk<TExtension>;

export interface TextChunk {
  kind: ChunkKind.Text;
  text: string;
}

export interface BindingChunk<TExtension> {
  kind: ChunkKind.Binding;
  binding: ExtendedBindingExpression<TExtension>;
}

export enum Unit {
  Pixels,
  Points,
  Centimeter,
  Millimeter,
  Inch
}

export type ExtendedBindingExpression<TExtension>
  = ExtendedStringLiteral<TExtension>
  | ExtendedNumberLiteral<TExtension>
  | ExtendedBooleanLiteral<TExtension>
  | ExtendedNullLiteral<TExtension>
  | ExtendedIdentifier<TExtension>
  | ExtendedPropertyAccess<TExtension>
  | ExtendedFunctionCall<TExtension>
  | ExtendedUnitAnnotation<TExtension>
  ;

export type ExtendedStringLiteral<TExtension> = BaseStringLiteral & TExtension;
export type ExtendedNumberLiteral<TExtension> = BaseNumberLiteral & TExtension;
export type ExtendedBooleanLiteral<TExtension> = BaseBooleanLiteral & TExtension;
export type ExtendedNullLiteral<TExtension> = BaseNullLiteral & TExtension;
export type ExtendedIdentifier<TExtension> = BaseIdentifier & TExtension;
export type ExtendedPropertyAccess<TExtension> = BasePropertyAccess<TExtension> & TExtension;
export type ExtendedFunctionCall<TExtension> = BaseFunctionCall<TExtension> & TExtension;
export type ExtendedUnitAnnotation<TExtension> = BaseUnitAnnotation<TExtension> & TExtension;

export interface BaseStringLiteral {
  kind: ExpressionKind.String;
  value: string;
}

export interface BaseNumberLiteral {
  kind: ExpressionKind.Number;
  value: number;
}

export interface BaseBooleanLiteral {
  kind: ExpressionKind.Boolean;
  value: boolean;
}

export interface BaseNullLiteral {
  kind: ExpressionKind.Null;
}

export interface BaseIdentifier {
  kind: ExpressionKind.Identifier;
  name: string;
}

export interface BaseFunctionCall<TExtension> {
  kind: ExpressionKind.FunctionCall;
  operand: ExtendedBindingExpression<TExtension>;
  actualParameters: ExtendedBindingExpression<TExtension>[];
}

export interface BasePropertyAccess<TExtension> {
  kind: ExpressionKind.PropertyAccess;
  operand: ExtendedBindingExpression<TExtension>;
  name: string;
}

export interface BaseUnitAnnotation<TExtension> {
  kind: ExpressionKind.UnitAnnotation;
  operand: ExtendedBindingExpression<TExtension>;
  unit: Unit;
}

export type BindingExpression = ExtendedBindingExpression<{}>;