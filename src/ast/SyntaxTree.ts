export enum ChunkKind {
  Text,
  Binding
}

export interface Chunk {
  kind: ChunkKind;
  payload: string | BindingExpression;
}

export type ChunkSequence = Chunk[];

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

export interface PropertyExpressionPayload {
  operand: BindingExpression;
  propertyName: string;
}

export interface FunctionCallExpressionPayload {
  operand: BindingExpression;
  parameters: BindingExpression[];
}

export interface UnitAnnotationPayload {
  operand: BindingExpression;
  unit: Unit;
}

export interface BindingExpression {
  type?: number;
  kind: BindingExpressionKind;
  payload
  : PropertyExpressionPayload
  | FunctionCallExpressionPayload
  | UnitAnnotationPayload
  | string
  | number
  | boolean
  | null
  ;
}

