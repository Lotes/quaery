import { ExtendedTextChunk, ExtendedBindingChunk, Unit, ExtendedFunctionCall, ExtendedPropertyAccess, ExtendedUnitAnnotation, ExtendedNode, ExtendedIdentifier, ExtendedNumberLiteral, ExtendedStringLiteral, ExtendedNullLiteral, ExtendedBooleanLiteral } from "./SyntaxTree";
import { NodeKind } from "./NodeKind";

export function newTextChunk<TExtension>(text: string, extension: TExtension): ExtendedTextChunk<TExtension> {
  return {
    ...extension,
    kind: NodeKind.TextChunk,
    text
  };
}

export function newBindingChunk<TExtension>(binding: ExtendedNode<TExtension>, extension: TExtension): ExtendedBindingChunk<TExtension> {
  return {
    ...extension,
    kind: NodeKind.BindingChunk,
    binding
  };
}

export function newIdentifier<TExtension>(name: string, extension: TExtension): ExtendedIdentifier<TExtension> {
  return {
    ...extension,
    kind: NodeKind.Identifier,
    name
  };
}

export function newNumber<TExtension>(value: number, extension: TExtension): ExtendedNumberLiteral<TExtension> {
  return {
    ...extension,
    kind: NodeKind.Number,
    value
  };
}

export function newString<TExtension>(value: string, extension: TExtension): ExtendedStringLiteral<TExtension> {
  return {
    ...extension,
    kind: NodeKind.String,
    value
  };
}

export function newNull<TExtension>(extension: TExtension): ExtendedNullLiteral<TExtension> {
  return {
    ...extension,
    kind: NodeKind.Null
  };
}

export function newBoolean<TExtension>(value: boolean, extension: TExtension): ExtendedBooleanLiteral<TExtension> {
  return {
    ...extension,
    kind: NodeKind.Boolean,
    value
  }
}

export function newUnitAnnotation<TExtension>(operand: ExtendedNode<TExtension>, unit: Unit, extension: TExtension): ExtendedUnitAnnotation<TExtension> {
  return {
    ...extension,
    kind: NodeKind.UnitAnnotation,
    operand,
    unit
  }
}

export function newPropertyAccess<TExtension>(operand: ExtendedNode<TExtension>, name: string, extension: TExtension): ExtendedPropertyAccess<TExtension> {
  return {
    ...extension,
    kind: NodeKind.PropertyAccess,
    name,
    operand
  };
}

export function newFunctionCall<TExtension>(operand: ExtendedNode<TExtension>, actualParameters: ExtendedNode<TExtension>[], extension: TExtension): ExtendedFunctionCall<TExtension> {
  return {
    ...extension,
    kind: NodeKind.FunctionCall,
    actualParameters,
    operand
  };
}