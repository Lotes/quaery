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

export enum BindingExpressionKind {
  String,
  Number,
  Boolean,
  Null,
  Identifier,
  PropertyAccess,
  FunctionCall,
  UnitAnnotation
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

export type ExtendedStringLiteral<TExtension> = StringLiteral & TExtension;
export type ExtendedNumberLiteral<TExtension> = NumberLiteral & TExtension;
export type ExtendedBooleanLiteral<TExtension> = BooleanLiteral & TExtension;
export type ExtendedNullLiteral<TExtension> = NullLiteral & TExtension;
export type ExtendedIdentifier<TExtension> = Identifier & TExtension;
export type ExtendedPropertyAccess<TExtension> = PropertyAccess<TExtension> & TExtension;
export type ExtendedFunctionCall<TExtension> = FunctionCall<TExtension> & TExtension;
export type ExtendedUnitAnnotation<TExtension> = UnitAnnotation<TExtension> & TExtension;

export interface StringLiteral {
  kind: BindingExpressionKind.String;
  value: string;
}

export interface NumberLiteral {
  kind: BindingExpressionKind.Number;
  value: number;
}

export interface BooleanLiteral {
  kind: BindingExpressionKind.Boolean;
  value: boolean;
}

export interface NullLiteral {
  kind: BindingExpressionKind.Null;
}

export interface Identifier {
  kind: BindingExpressionKind.Identifier;
  name: string;
}

export interface FunctionCall<TExtension> {
  kind: BindingExpressionKind.FunctionCall;
  operand: ExtendedBindingExpression<TExtension>;
  actualParameters: ExtendedBindingExpression<TExtension>[];
}

export interface PropertyAccess<TExtension> {
  kind: BindingExpressionKind.PropertyAccess;
  operand: ExtendedBindingExpression<TExtension>;
  name: string;
}

export interface UnitAnnotation<TExtension> {
  kind: BindingExpressionKind.UnitAnnotation;
  operand: ExtendedBindingExpression<TExtension>;
  unit: Unit;
}

export type BindingExpression = ExtendedBindingExpression<{}>;