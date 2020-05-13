import { NodeKind } from "./NodeKind";

export enum Unit {
  Pixels,
  Points,
  Centimeter,
  Millimeter,
  Inch
}

export type ExtendedChunk<TExtension>
  = ExtendedTextChunk<TExtension>
  | ExtendedBindingChunk<TExtension>
  ;

export type ExtendedNode<TExtension>
  = ExtendedTextChunk<TExtension>
  | ExtendedBindingChunk<TExtension>
  | ExtendedStringLiteral<TExtension>
  | ExtendedNumberLiteral<TExtension>
  | ExtendedBooleanLiteral<TExtension>
  | ExtendedNullLiteral<TExtension>
  | ExtendedIdentifier<TExtension>
  | ExtendedPropertyAccess<TExtension>
  | ExtendedFunctionCall<TExtension>
  | ExtendedUnitAnnotation<TExtension>
  ;

export type ExtendedTextChunk<TExtension> = BaseTextChunk & TExtension;
export type ExtendedBindingChunk<TExtension> = BaseBindingChunk<TExtension> & TExtension;
export type ExtendedStringLiteral<TExtension> = BaseStringLiteral & TExtension;
export type ExtendedNumberLiteral<TExtension> = BaseNumberLiteral & TExtension;
export type ExtendedBooleanLiteral<TExtension> = BaseBooleanLiteral & TExtension;
export type ExtendedNullLiteral<TExtension> = BaseNullLiteral & TExtension;
export type ExtendedIdentifier<TExtension> = BaseIdentifier & TExtension;
export type ExtendedPropertyAccess<TExtension> = BasePropertyAccess<TExtension> & TExtension;
export type ExtendedFunctionCall<TExtension> = BaseFunctionCall<TExtension> & TExtension;
export type ExtendedUnitAnnotation<TExtension> = BaseUnitAnnotation<TExtension> & TExtension;

export interface BaseTextChunk {
  kind: NodeKind.TextChunk;
  text: string;
}

export interface BaseBindingChunk<TExtension> {
  kind: NodeKind.BindingChunk;
  binding: ExtendedNode<TExtension>;
}

export interface BaseStringLiteral {
  kind: NodeKind.String;
  value: string;
}

export interface BaseNumberLiteral {
  kind: NodeKind.Number;
  value: number;
}

export interface BaseBooleanLiteral {
  kind: NodeKind.Boolean;
  value: boolean;
}

export interface BaseNullLiteral {
  kind: NodeKind.Null;
}

export interface BaseIdentifier {
  kind: NodeKind.Identifier;
  name: string;
}

export interface BaseFunctionCall<TExtension> {
  kind: NodeKind.FunctionCall;
  operand: ExtendedNode<TExtension>;
  actualParameters: ExtendedNode<TExtension>[];
}

export interface BasePropertyAccess<TExtension> {
  kind: NodeKind.PropertyAccess;
  operand: ExtendedNode<TExtension>;
  name: string;
}

export interface BaseUnitAnnotation<TExtension> {
  kind: NodeKind.UnitAnnotation;
  operand: ExtendedNode<TExtension>;
  unit: Unit;
}

export type Node = ExtendedNode<{}>;
export type Chunk = ExtendedChunk<{}>;