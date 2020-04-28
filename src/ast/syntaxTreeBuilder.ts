import { TextChunk, BindingExpression, ChunkKind, BindingChunk, Identifier, BindingExpressionKind, NumberLiteral, StringLiteral, NullLiteral, BooleanLiteral, Unit, UnitAnnotation, PropertyAccess, FunctionCall } from "./SyntaxTree";

export function newTextChunk(text: string): TextChunk<BindingExpression> {
  return {
    kind: ChunkKind.Text,
    text
  };
}

export function newBindingChunk(binding: BindingExpression): BindingChunk<BindingExpression> {
  return {
    kind: ChunkKind.Binding,
    binding
  };
}

export function newIdentifier(name: string): Identifier<BindingExpression> {
  return {
    kind: BindingExpressionKind.Identifier,
    name
  };
}

export function newNumber(value: number): NumberLiteral<BindingExpression> {
  return {
    kind: BindingExpressionKind.Number,
    value
  };
}

export function newString(value: string): StringLiteral<BindingExpression> {
  return {
    kind: BindingExpressionKind.String,
    value
  };
}

export function newNull(): NullLiteral<BindingExpression> {
  return {
    kind: BindingExpressionKind.Null
  };
}

export function newBoolean(value: boolean): BooleanLiteral<BindingExpression> {
  return {
    kind: BindingExpressionKind.Boolean,
    value
  }
}

export function newUnitAnnotation(operand: BindingExpression, unit: Unit): UnitAnnotation<BindingExpression> {
  return {
    kind: BindingExpressionKind.UnitAnnotation,
    operand,
    unit
  }
}

export function newPropertyAccess(operand: BindingExpression, name: string): PropertyAccess<BindingExpression> {
  return {
    kind: BindingExpressionKind.PropertyAccess,
    name,
    operand
  };
}

export function newFunctionCall(operand: BindingExpression, actualParameters: BindingExpression[]): FunctionCall<BindingExpression> {
  return {
    kind: BindingExpressionKind.FunctionCall,
    actualParameters,
    operand
  };
}