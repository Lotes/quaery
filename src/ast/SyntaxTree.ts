export enum ChunkKind {
  Text,
  Binding
}

export interface Chunk<TBindingExpression extends GenericBindingExpression<TBindingExpression>> {
  kind: ChunkKind;
}

export interface TextChunk<TBindingExpression extends GenericBindingExpression<TBindingExpression>> extends Chunk<TBindingExpression> {
  text: string;
}

export interface BindingChunk<TBindingExpression extends GenericBindingExpression<TBindingExpression>> extends Chunk<TBindingExpression> {
  binding: TBindingExpression;
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

export interface GenericBindingExpression<TSelf extends GenericBindingExpression<TSelf>> {
  kind: BindingExpressionKind;
}

export interface StringLiteral<TSelf extends GenericBindingExpression<TSelf>> extends GenericBindingExpression<TSelf> {
  value: string;
}

export interface NumberLiteral<TSelf extends GenericBindingExpression<TSelf>> extends GenericBindingExpression<TSelf> {
  value: number;
}

export interface BooleanLiteral<TSelf extends GenericBindingExpression<TSelf>> extends GenericBindingExpression<TSelf> {
  value: boolean;
}

export interface NullLiteral<TSelf extends GenericBindingExpression<TSelf>> extends GenericBindingExpression<TSelf> {
}

export interface Identifier<TSelf extends GenericBindingExpression<TSelf>> extends GenericBindingExpression<TSelf> {
  name: string;
}

export interface FunctionCall<TSelf extends GenericBindingExpression<TSelf>> extends GenericBindingExpression<TSelf> {
  operand: TSelf;
  actualParameters: TSelf[];
}

export interface PropertyAccess<TSelf extends GenericBindingExpression<TSelf>> extends GenericBindingExpression<TSelf> {
  operand: TSelf;
  name: string;
}

export interface UnitAnnotation<TSelf extends GenericBindingExpression<TSelf>> extends GenericBindingExpression<TSelf> {
  operand: TSelf;
  unit: Unit;
}

export type BindingExpression = GenericBindingExpression<BindingExpression>;