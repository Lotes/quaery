import { ExtendedBindingExpression, Chunk, ChunkKind, BindingExpressionKind, TextChunk, BindingChunk, UnitAnnotation, PropertyAccess, FunctionCall, StringLiteral, NumberLiteral, BooleanLiteral, Identifier } from "../ast/SyntaxTree";
import { AggregateError } from "../AggregateError";
import { newTextChunk } from "./factory";

export interface SyntaxTreeFolder<TArgument, TInputExtension, TOutputExtension> {
  visitChunk(chunk: Chunk<TInputExtension>, arg: TArgument): Chunk<TOutputExtension>;
  visitChunk_Text(chunk: TextChunk, arg: TArgument): Chunk<TOutputExtension>;
  visitChunk_Binding(chunk: BindingChunk<TOutputExtension>, arg: TArgument): Chunk<TOutputExtension>;
  //node expressions
  visitBinding(binding: ExtendedBindingExpression<TInputExtension>, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  visitBinding_UnitAnnotation(binding: UnitAnnotation<TOutputExtension>, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  visitBinding_Property(binding: PropertyAccess<TOutputExtension>, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  visitBinding_FunctionCall(binding: FunctionCall<TOutputExtension>, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  //leaf expressions
  visitBinding_StringLiteral(binding: StringLiteral, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  visitBinding_NumberLiteral(binding: NumberLiteral, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  visitBinding_BooleanLiteral(binding: BooleanLiteral, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  visitBinding_NullLiteral(arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  visitBinding_Identifier(binding: Identifier, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
}

export abstract class AbstractSyntaxTreeFolder<
  TArgument,
  TInputExtension,
  TOutputExtension
  > implements SyntaxTreeFolder<TArgument, TInputExtension, TOutputExtension>  {
  visitChunk(chunk: Chunk<TInputExtension>, arg: TArgument): Chunk<TOutputExtension> {
    if (chunk.kind === ChunkKind.Text) {
      return this.visitChunk_Text(chunk as TextChunk, arg);
    } else {
      const chunkIn = chunk as BindingChunk<TInputExtension>;
      const bindingOut = this.visitBinding(chunkIn.binding, arg);
      return this.visitChunk_Binding({
        ...chunkIn,
        binding: bindingOut
      }, arg);
    }
  }
  visitChunk_Text(chunk: TextChunk, arg: TArgument): Chunk<TOutputExtension> {
    return {
      ...chunk
    };
  }

  visitBinding(binding: ExtendedBindingExpression<TInputExtension>, arg: TArgument): ExtendedBindingExpression<TOutputExtension> {
    switch (binding.kind) {
      case BindingExpressionKind.Boolean: return this.visitBinding_BooleanLiteral(binding as unknown as BooleanLiteral, arg);
      case BindingExpressionKind.Number: return this.visitBinding_NumberLiteral(binding as unknown as NumberLiteral, arg);
      case BindingExpressionKind.String: return this.visitBinding_StringLiteral(binding as unknown as StringLiteral, arg);
      case BindingExpressionKind.Null: return this.visitBinding_NullLiteral(arg);
      case BindingExpressionKind.Identifier: return this.visitBinding_Identifier(binding as unknown as Identifier, arg);
      case BindingExpressionKind.PropertyAccess: {
        const propertyIn = binding as unknown as PropertyAccess<TInputExtension>;
        const propertyOperandOut = this.visitBinding(propertyIn.operand, arg);
        return this.visitBinding_Property({
          ...propertyIn,
          operand: propertyOperandOut
        }, arg);
      }
      case BindingExpressionKind.FunctionCall: {
        const functionCallIn = binding as unknown as FunctionCall<TInputExtension>;
        const operandOut = this.visitBinding(functionCallIn.operand, arg);
        const parametersOut = functionCallIn.actualParameters.map(p => this.visitBinding(p, arg));
        return this.visitBinding_FunctionCall({
          ...functionCallIn,
          operand: operandOut,
          actualParameters: parametersOut
        }, arg);
      }
      case BindingExpressionKind.UnitAnnotation: {
        const unitAnnotationIn = binding as unknown as UnitAnnotation<TInputExtension>;
        const operandOut = this.visitBinding(unitAnnotationIn.operand, arg);
        return this.visitBinding_UnitAnnotation({
          ...unitAnnotationIn,
          operand: operandOut
        }, arg);
      }
    }
  }
  abstract visitChunk_Binding(chunk: BindingChunk<TOutputExtension>, arg: TArgument): BindingChunk<TOutputExtension>;
  abstract visitBinding_UnitAnnotation(annotation: UnitAnnotation<TOutputExtension>, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  abstract visitBinding_Property(property: PropertyAccess<TOutputExtension>, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  abstract visitBinding_FunctionCall(functionCall: FunctionCall<TOutputExtension>, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  abstract visitBinding_StringLiteral(binding: StringLiteral, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  abstract visitBinding_NumberLiteral(binding: NumberLiteral, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  abstract visitBinding_BooleanLiteral(binding: BooleanLiteral, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  abstract visitBinding_NullLiteral(arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  abstract visitBinding_Identifier(binding: Identifier, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
}

export function createFold<
  TArgument,
  TInputExtension,
  TOutputExtension
>
  (
    folder: SyntaxTreeFolder<TArgument, TInputExtension, TOutputExtension>
  ) {
  return (sequence: Chunk<TInputExtension>[], argument: TArgument): Chunk<TOutputExtension>[] => {
    const errors: Error[] = [];
    const result = sequence.map(ch => {
      try {
        return folder.visitChunk(ch, argument);
      } catch (e) {
        errors.push(e);
        return newTextChunk<{}>("", {});
      }
    });

    if (errors.length > 0) {
      throw new AggregateError(errors);
    }

    return result;
  }
}