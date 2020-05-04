import { ExtendedBindingExpression, Chunk, ChunkKind, BindingExpressionKind, TextChunk, BindingChunk, ExtendedUnitAnnotation, ExtendedPropertyAccess, ExtendedNullLiteral, ExtendedFunctionCall, ExtendedStringLiteral, ExtendedNumberLiteral, ExtendedBooleanLiteral, ExtendedIdentifier, BaseUnitAnnotation, BasePropertyAccess, BaseFunctionCall } from "../ast/SyntaxTree";
import { AggregateError } from "../AggregateError";
import { newTextChunk } from "./factory";

export interface SyntaxTreeFolder<TArgument, TInputExtension, TOutputExtension> {
  visitChunk(chunk: Chunk<TInputExtension>, arg: TArgument): Chunk<TOutputExtension>;
  visitChunk_Text(chunk: TextChunk, arg: TArgument): Chunk<TOutputExtension>;
  visitChunk_Binding(chunk: BindingChunk<TOutputExtension>, arg: TArgument): Chunk<TOutputExtension>;
  //node expressions
  visitBinding(binding: ExtendedBindingExpression<TInputExtension>, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  visitBinding_UnitAnnotation(binding: BaseUnitAnnotation<TOutputExtension>, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  visitBinding_Property(binding: BasePropertyAccess<TOutputExtension>, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  visitBinding_FunctionCall(binding: BaseFunctionCall<TOutputExtension>, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  //leaf expressions
  visitBinding_StringLiteral(binding: ExtendedStringLiteral<TInputExtension>, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  visitBinding_NumberLiteral(binding: ExtendedNumberLiteral<TInputExtension>, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  visitBinding_BooleanLiteral(binding: ExtendedBooleanLiteral<TInputExtension>, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  visitBinding_NullLiteral(binding: ExtendedNullLiteral<TInputExtension>, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  visitBinding_Identifier(binding: ExtendedIdentifier<TInputExtension>, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
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
  abstract visitBinding(binding: ExtendedBindingExpression<TInputExtension>, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  abstract visitChunk_Binding(chunk: BindingChunk<TOutputExtension>, arg: TArgument): BindingChunk<TOutputExtension>;

  abstract visitBinding_UnitAnnotation(annotation: BaseUnitAnnotation<TOutputExtension>, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  abstract visitBinding_Property(property: BasePropertyAccess<TOutputExtension>, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  abstract visitBinding_FunctionCall(functionCall: BaseFunctionCall<TOutputExtension>, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;

  abstract visitBinding_StringLiteral(binding: ExtendedStringLiteral<TInputExtension>, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  abstract visitBinding_NumberLiteral(binding: ExtendedNumberLiteral<TInputExtension>, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  abstract visitBinding_BooleanLiteral(binding: ExtendedBooleanLiteral<TInputExtension>, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  abstract visitBinding_NullLiteral(binding: ExtendedNullLiteral<TInputExtension>, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
  abstract visitBinding_Identifier(binding: ExtendedIdentifier<TInputExtension>, arg: TArgument): ExtendedBindingExpression<TOutputExtension>;
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
        return newTextChunk("");
      }
    });

    if (errors.length > 0) {
      throw new AggregateError(errors);
    }

    return result;
  }
}