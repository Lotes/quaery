export enum ChunkKind {
  Text,
  Binding
}

export interface Chunk<TBinding = BindingExpression> {
  kind: ChunkKind;
  payload: string | TBinding;
}

export type ChunkSequence<TBinding = BindingExpression> = Chunk<TBinding>[];

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

export interface PropertyExpressionPayload<TBinding = BindingExpression> {
  operand: TBinding;
  propertyName: string;
}

export interface FunctionCallExpressionPayload<TBinding = BindingExpression> {
  operand: TBinding;
  parameters: TBinding[];
}

export interface UnitAnnotationPayload<TBinding = BindingExpression> {
  operand: TBinding;
  unit: Unit;
}

export interface GenericBindingExpression<TSelf extends GenericBindingExpression<TSelf>> {
  kind: BindingExpressionKind;
  payload
  : PropertyExpressionPayload<TSelf>
  | FunctionCallExpressionPayload<TSelf>
  | UnitAnnotationPayload<TSelf>
  | string
  | number
  | boolean
  | null
  ;
}

export type BindingExpression = GenericBindingExpression<BindingExpression>;

