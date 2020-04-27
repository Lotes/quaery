import { BindingExpression, UnitAnnotationPayload, PropertyExpressionPayload, FunctionCallExpressionPayload, ChunkSequence, ChunkKind, BindingExpressionKind, GenericBindingExpression } from "./SyntaxTree";
import { Chunk } from "../ast/SyntaxTree";

export interface SyntaxTreeFolder<TArgument, TInputBinding = BindingExpression, TOutputBinding = void> {
  visitChunk(chunk: Chunk<TInputBinding>, arg: TArgument): Chunk<TOutputBinding>;
  visitChunk_Text(text: string, arg: TArgument): Chunk<TOutputBinding>;
  visitChunk_Binding(binding: TOutputBinding, arg: TArgument): Chunk<TOutputBinding>;
  //node expressions
  visitBinding(binding: TInputBinding, arg: TArgument): TOutputBinding;
  visitBinding_UnitAnnotation(annotation: UnitAnnotationPayload<TOutputBinding>, arg: TArgument): TOutputBinding;
  visitBinding_Property(property: PropertyExpressionPayload<TOutputBinding>, arg: TArgument): TOutputBinding;
  visitBinding_FunctionCall(functionCall: FunctionCallExpressionPayload<TOutputBinding>, arg: TArgument): TOutputBinding;
  //leaf expressions
  visitBinding_StringLiteral(value: string, arg: TArgument): TOutputBinding;
  visitBinding_NumberLiteral(value: number, arg: TArgument): TOutputBinding;
  visitBinding_BooleanLiteral(value: boolean, arg: TArgument): TOutputBinding;
  visitBinding_NullLiteral(arg: TArgument): TOutputBinding;
  visitBinding_Identifier(identifier: string, arg: TArgument): TOutputBinding;
}

export abstract class AbstractSyntaxTreeFolder<TArgument, TInputBinding extends GenericBindingExpression<TInputBinding>, TOutputBinding = void> implements SyntaxTreeFolder<TArgument, TInputBinding, TOutputBinding>  {
  visitChunk(chunk: Chunk<TInputBinding>, arg: TArgument): Chunk<TOutputBinding> {
    if (chunk.kind === ChunkKind.Text) {
      return this.visitChunk_Text(chunk.payload as string, arg);
    } else {
      const outBinding = this.visitBinding(chunk.payload as TInputBinding, arg);
      return this.visitChunk_Binding(outBinding, arg);
    }
  }
  visitChunk_Text(text: string, arg: TArgument): Chunk<TOutputBinding> {
    return {
      kind: ChunkKind.Text,
      payload: text
    }
  }

  abstract visitChunk_Binding(binding: TOutputBinding, arg: TArgument): Chunk<TOutputBinding>;

  visitBinding(binding: TInputBinding, arg: TArgument): TOutputBinding {
    switch (binding.kind) {
      case BindingExpressionKind.Boolean: return this.visitBinding_BooleanLiteral(binding.payload as boolean, arg);
      case BindingExpressionKind.Number: return this.visitBinding_NumberLiteral(binding.payload as number, arg);
      case BindingExpressionKind.String: return this.visitBinding_StringLiteral(binding.payload as string, arg);
      case BindingExpressionKind.Null: return this.visitBinding_NullLiteral(arg);
      case BindingExpressionKind.Identifier: return this.visitBinding_Identifier(binding.payload as string, arg);
      case BindingExpressionKind.PropertyAccess:
        const propertyPayload = binding.payload as PropertyExpressionPayload<TInputBinding>;
        const propertyOut = this.visitBinding(propertyPayload.operand, arg);
        return this.visitBinding_Property({
          operand: propertyOut,
          propertyName: propertyPayload.propertyName
        }, arg);
      case BindingExpressionKind.FunctionCall:
        const functionCallPayload = binding.payload as FunctionCallExpressionPayload<TInputBinding>;
        const functionOut = this.visitBinding(functionCallPayload.operand, arg);
        const parametersOut = functionCallPayload.parameters.map(p => this.visitBinding(p, arg));
        return this.visitBinding_FunctionCall({
          operand: functionOut,
          parameters: parametersOut
        }, arg);
      case BindingExpressionKind.UnitAnnotation:
        const unitAnnotationPayload = binding.payload as UnitAnnotationPayload<TInputBinding>;
        const valueOut = this.visitBinding(unitAnnotationPayload.operand, arg);
        return this.visitBinding_UnitAnnotation({
          operand: valueOut,
          unit: unitAnnotationPayload.unit
        }, arg);
    }
  }
  abstract visitBinding_UnitAnnotation(annotation: UnitAnnotationPayload<TOutputBinding>, arg: TArgument): TOutputBinding;
  abstract visitBinding_Property(property: PropertyExpressionPayload<TOutputBinding>, arg: TArgument): TOutputBinding;
  abstract visitBinding_FunctionCall(functionCall: FunctionCallExpressionPayload<TOutputBinding>, arg: TArgument): TOutputBinding;
  abstract visitBinding_StringLiteral(value: string, arg: TArgument): TOutputBinding;
  abstract visitBinding_NumberLiteral(value: number, arg: TArgument): TOutputBinding;
  abstract visitBinding_BooleanLiteral(value: boolean, arg: TArgument): TOutputBinding;
  abstract visitBinding_NullLiteral(arg: TArgument): TOutputBinding;
  abstract visitBinding_Identifier(identifier: string, arg: TArgument): TOutputBinding;
}

export function createFold<
  TArgument,
  TInputBinding extends GenericBindingExpression<TInputBinding>,
  TOutputBinding extends GenericBindingExpression<TOutputBinding>>
  (
    folder: SyntaxTreeFolder<TArgument, TInputBinding, TOutputBinding>
  ) {
  return (sequence: ChunkSequence<TInputBinding>, argument: TArgument): Chunk<TOutputBinding>[] => {
    return sequence.map(ch => folder.visitChunk(ch, argument));
  }
}