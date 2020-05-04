import { TextChunk, ChunkKind, BindingChunk, Unit, ExtendedFunctionCall, ExtendedPropertyAccess, ExtendedUnitAnnotation, ExtendedBindingExpression, ExtendedIdentifier, ExtendedNumberLiteral, ExtendedStringLiteral, ExtendedNullLiteral, ExtendedBooleanLiteral } from "./SyntaxTree";
import { ExpressionKind } from "./ExpressionKind";
import { Token } from "antlr4ts";
import { Range } from "./RangeExtensions";

export function newTextChunk(text: string): TextChunk {
  return {
    kind: ChunkKind.Text,
    text
  };
}

export function newBindingChunk<TExtension>(binding: ExtendedBindingExpression<TExtension>): BindingChunk<TExtension> {
  return {
    kind: ChunkKind.Binding,
    binding
  };
}

export function newIdentifier<TExtension>(name: string, extension: TExtension): ExtendedIdentifier<TExtension> {
  return {
    ...extension,
    kind: ExpressionKind.Identifier,
    name
  };
}

export function newNumber<TExtension>(value: number, extension: TExtension): ExtendedNumberLiteral<TExtension> {
  return {
    ...extension,
    kind: ExpressionKind.Number,
    value
  };
}

export function newString<TExtension>(value: string, extension: TExtension): ExtendedStringLiteral<TExtension> {
  return {
    ...extension,
    kind: ExpressionKind.String,
    value
  };
}

export function newNull<TExtension>(extension: TExtension): ExtendedNullLiteral<TExtension> {
  return {
    ...extension,
    kind: ExpressionKind.Null
  };
}

export function newBoolean<TExtension>(value: boolean, extension: TExtension): ExtendedBooleanLiteral<TExtension> {
  return {
    ...extension,
    kind: ExpressionKind.Boolean,
    value
  }
}

export function newUnitAnnotation<TExtension>(operand: ExtendedBindingExpression<TExtension>, unit: Unit, extension: TExtension): ExtendedUnitAnnotation<TExtension> {
  return {
    ...extension,
    kind: ExpressionKind.UnitAnnotation,
    operand,
    unit
  }
}

export function newPropertyAccess<TExtension>(operand: ExtendedBindingExpression<TExtension>, name: string, extension: TExtension): ExtendedPropertyAccess<TExtension> {
  return {
    ...extension,
    kind: ExpressionKind.PropertyAccess,
    name,
    operand
  };
}

export function newFunctionCall<TExtension>(operand: ExtendedBindingExpression<TExtension>, actualParameters: ExtendedBindingExpression<TExtension>[], extension: TExtension): ExtendedFunctionCall<TExtension> {
  return {
    ...extension,
    kind: ExpressionKind.FunctionCall,
    actualParameters,
    operand
  };
}

export function newRangeFromTokens(first: Token, last?: Token): Range {
  last = last || first;
  return {
    startIndex: first.startIndex,
    stopIndex: last.stopIndex
  };
}