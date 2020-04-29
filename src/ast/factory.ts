import { TextChunk, ChunkKind, BindingChunk, BindingExpressionKind, Unit, ExtendedFunctionCall, ExtendedPropertyAccess, ExtendedUnitAnnotation, ExtendedBindingExpression, ExtendedIdentifier, ExtendedNumberLiteral, ExtendedStringLiteral, ExtendedNullLiteral, ExtendedBooleanLiteral } from "./SyntaxTree";

export function newTextChunk<TExtension>(text: string, extension: TExtension): TextChunk {
  return {
    ...extension,
    kind: ChunkKind.Text,
    text
  };
}

export function newBindingChunk<TExtension>(binding: ExtendedBindingExpression<TExtension>, extension: TExtension): BindingChunk<TExtension> {
  return {
    ...extension,
    kind: ChunkKind.Binding,
    binding
  };
}

export function newIdentifier<TExtension>(name: string, extension: TExtension): ExtendedIdentifier<TExtension> {
  return {
    ...extension,
    kind: BindingExpressionKind.Identifier,
    name
  };
}

export function newNumber<TExtension>(value: number, extension: TExtension): ExtendedNumberLiteral<TExtension> {
  return {
    ...extension,
    kind: BindingExpressionKind.Number,
    value
  };
}

export function newString<TExtension>(value: string, extension: TExtension): ExtendedStringLiteral<TExtension> {
  return {
    ...extension,
    kind: BindingExpressionKind.String,
    value
  };
}

export function newNull<TExtension>(extension: TExtension): ExtendedNullLiteral<TExtension> {
  return {
    ...extension,
    kind: BindingExpressionKind.Null
  };
}

export function newBoolean<TExtension>(value: boolean, extension: TExtension): ExtendedBooleanLiteral<TExtension> {
  return {
    ...extension,
    kind: BindingExpressionKind.Boolean,
    value
  }
}

export function newUnitAnnotation<TExtension>(operand: ExtendedBindingExpression<TExtension>, unit: Unit, extension: TExtension): ExtendedUnitAnnotation<TExtension> {
  return {
    ...extension,
    kind: BindingExpressionKind.UnitAnnotation,
    operand,
    unit
  }
}

export function newPropertyAccess<TExtension>(operand: ExtendedBindingExpression<TExtension>, name: string, extension: TExtension): ExtendedPropertyAccess<TExtension> {
  return {
    ...extension,
    kind: BindingExpressionKind.PropertyAccess,
    name,
    operand
  };
}

export function newFunctionCall<TExtension>(operand: ExtendedBindingExpression<TExtension>, actualParameters: ExtendedBindingExpression<TExtension>[], extension: TExtension): ExtendedFunctionCall<TExtension> {
  return {
    ...extension,
    kind: BindingExpressionKind.FunctionCall,
    actualParameters,
    operand
  };
}