import { Chunk, GenericBindingExpression, ChunkKind, BindingExpressionKind, TextChunk, BindingChunk, UnitAnnotation, PropertyAccess, FunctionCall, StringLiteral, NumberLiteral, BooleanLiteral, Identifier } from "../ast/SyntaxTree";
import { AggregateError } from "../AggregateError";

export interface SyntaxTreeFolder<TArgument, TInputBinding extends GenericBindingExpression<TInputBinding>, TOutputBinding extends GenericBindingExpression<TInputBinding>> {
  visitChunk(chunk: Chunk<TInputBinding>, arg: TArgument): Chunk<TOutputBinding>;
  visitChunk_Text(chunk: TextChunk<TOutputBinding>, arg: TArgument): Chunk<TOutputBinding>;
  visitChunk_Binding(chunk: BindingChunk<TOutputBinding>, arg: TArgument): Chunk<TOutputBinding>;
  //node expressions
  visitBinding(binding: TInputBinding, arg: TArgument): TOutputBinding;
  visitBinding_UnitAnnotation(binding: UnitAnnotation<TOutputBinding>, arg: TArgument): TOutputBinding;
  visitBinding_Property(binding: PropertyAccess<TOutputBinding>, arg: TArgument): TOutputBinding;
  visitBinding_FunctionCall(binding: FunctionCall<TOutputBinding>, arg: TArgument): TOutputBinding;
  //leaf expressions
  visitBinding_StringLiteral(binding: StringLiteral<TInputBinding>, arg: TArgument): TOutputBinding;
  visitBinding_NumberLiteral(binding: NumberLiteral<TInputBinding>, arg: TArgument): TOutputBinding;
  visitBinding_BooleanLiteral(binding: BooleanLiteral<TInputBinding>, arg: TArgument): TOutputBinding;
  visitBinding_NullLiteral(arg: TArgument): TOutputBinding;
  visitBinding_Identifier(binding: Identifier<TInputBinding>, arg: TArgument): TOutputBinding;
}

export abstract class AbstractSyntaxTreeFolder<
  TArgument,
  TInputBinding extends GenericBindingExpression<TInputBinding>,
  TOutputBinding extends GenericBindingExpression<TOutputBinding>
  > implements SyntaxTreeFolder<TArgument, TInputBinding, TOutputBinding>  {
  visitChunk(chunk: Chunk<TInputBinding>, arg: TArgument): Chunk<TOutputBinding> {
    if (chunk.kind === ChunkKind.Text) {
      return this.visitChunk_Text(chunk as TextChunk<TOutputBinding>, arg);
    } else {
      const chunkIn = chunk as BindingChunk<TInputBinding>;
      const bindingOut = this.visitBinding(chunkIn.binding, arg);
      return this.visitChunk_Binding({
        ...chunkIn,
        binding: bindingOut
      }, arg);
    }
  }
  visitChunk_Text(chunk: TextChunk<TOutputBinding>, arg: TArgument): Chunk<TOutputBinding> {
    return {
      ...chunk
    };
  }

  visitBinding(binding: TInputBinding, arg: TArgument): TOutputBinding {
    switch (binding.kind) {
      case BindingExpressionKind.Boolean: return this.visitBinding_BooleanLiteral(binding as unknown as BooleanLiteral<TInputBinding>, arg);
      case BindingExpressionKind.Number: return this.visitBinding_NumberLiteral(binding as unknown as NumberLiteral<TInputBinding>, arg);
      case BindingExpressionKind.String: return this.visitBinding_StringLiteral(binding as unknown as StringLiteral<TInputBinding>, arg);
      case BindingExpressionKind.Null: return this.visitBinding_NullLiteral(arg);
      case BindingExpressionKind.Identifier: return this.visitBinding_Identifier(binding as unknown as Identifier<TInputBinding>, arg);
      case BindingExpressionKind.PropertyAccess: {
        const propertyIn = binding as unknown as PropertyAccess<TInputBinding>;
        const propertyOperandOut = this.visitBinding(propertyIn.operand, arg);
        return this.visitBinding_Property({
          ...propertyIn,
          operand: propertyOperandOut
        }, arg);
      }
      case BindingExpressionKind.FunctionCall: {
        const functionCallIn = binding as unknown as FunctionCall<TInputBinding>;
        const operandOut = this.visitBinding(functionCallIn.operand, arg);
        const parametersOut = functionCallIn.actualParameters.map(p => this.visitBinding(p, arg));
        return this.visitBinding_FunctionCall({
          ...functionCallIn,
          operand: operandOut,
          actualParameters: parametersOut
        }, arg);
      }
      case BindingExpressionKind.UnitAnnotation: {
        const unitAnnotationIn = binding as unknown as UnitAnnotation<TInputBinding>;
        const operandOut = this.visitBinding(unitAnnotationIn.operand, arg);
        return this.visitBinding_UnitAnnotation({
          ...unitAnnotationIn,
          operand: operandOut
        }, arg);
      }
    }
  }
  abstract visitChunk_Binding(chunk: BindingChunk<TOutputBinding>, arg: TArgument): BindingChunk<TOutputBinding>;
  abstract visitBinding_UnitAnnotation(annotation: UnitAnnotation<TOutputBinding>, arg: TArgument): TOutputBinding;
  abstract visitBinding_Property(property: PropertyAccess<TOutputBinding>, arg: TArgument): TOutputBinding;
  abstract visitBinding_FunctionCall(functionCall: FunctionCall<TOutputBinding>, arg: TArgument): TOutputBinding;
  abstract visitBinding_StringLiteral(binding: StringLiteral<TInputBinding>, arg: TArgument): TOutputBinding;
  abstract visitBinding_NumberLiteral(binding: NumberLiteral<TInputBinding>, arg: TArgument): TOutputBinding;
  abstract visitBinding_BooleanLiteral(binding: BooleanLiteral<TInputBinding>, arg: TArgument): TOutputBinding;
  abstract visitBinding_NullLiteral(arg: TArgument): TOutputBinding;
  abstract visitBinding_Identifier(binding: Identifier<TInputBinding>, arg: TArgument): TOutputBinding;
}

export function createFold<
  TArgument,
  TInputBinding extends GenericBindingExpression<TInputBinding>,
  TOutputBinding extends GenericBindingExpression<TOutputBinding>>
  (
    folder: SyntaxTreeFolder<TArgument, TInputBinding, TOutputBinding>
  ) {
  return (sequence: Chunk<TInputBinding>[], argument: TArgument): Chunk<TOutputBinding>[] => {
    const errors: Error[] = [];
    const result = sequence.map(ch => {
      try {
        return folder.visitChunk(ch, argument);
      } catch (e) {
        errors.push(e);
        return {
          kind: ChunkKind.Text,
          payload: ""
        };
      }
    });

    if (errors.length > 0) {
      throw new AggregateError(errors);
    }

    return result;
  }
}