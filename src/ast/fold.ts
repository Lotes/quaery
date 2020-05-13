import { ExtendedChunk, ExtendedTextChunk, ExtendedBindingChunk, ExtendedNode, ExtendedNullLiteral, ExtendedStringLiteral, ExtendedNumberLiteral, ExtendedBooleanLiteral, ExtendedIdentifier, BaseUnitAnnotation, BasePropertyAccess, BaseFunctionCall, BaseTextChunk, BaseBindingChunk } from "../ast/SyntaxTree";
import { AggregateError } from "../errors/AggregateError";
import { newTextChunk } from "./factory";
import { NodeKind } from "./NodeKind";

export interface SyntaxTreeFolder<TArgument, TInputExtension, TOutputExtension> {
  visitChunk(chunk: ExtendedChunk<TInputExtension>, arg: TArgument): ExtendedChunk<TOutputExtension>;
  visitChunk_Text(chunk: BaseTextChunk, arg: TArgument): ExtendedChunk<TOutputExtension>;
  visitChunk_Binding(chunk: BaseBindingChunk<TOutputExtension>, arg: TArgument): ExtendedChunk<TOutputExtension>;
  //node expressions
  visitBinding(binding: ExtendedNode<TInputExtension>, arg: TArgument): ExtendedNode<TOutputExtension>;
  visitBinding_UnitAnnotation(binding: BaseUnitAnnotation<TOutputExtension>, arg: TArgument): ExtendedNode<TOutputExtension>;
  visitBinding_Property(binding: BasePropertyAccess<TOutputExtension>, arg: TArgument): ExtendedNode<TOutputExtension>;
  visitBinding_FunctionCall(binding: BaseFunctionCall<TOutputExtension>, arg: TArgument): ExtendedNode<TOutputExtension>;
  //leaf expressions
  visitBinding_StringLiteral(binding: ExtendedStringLiteral<TInputExtension>, arg: TArgument): ExtendedNode<TOutputExtension>;
  visitBinding_NumberLiteral(binding: ExtendedNumberLiteral<TInputExtension>, arg: TArgument): ExtendedNode<TOutputExtension>;
  visitBinding_BooleanLiteral(binding: ExtendedBooleanLiteral<TInputExtension>, arg: TArgument): ExtendedNode<TOutputExtension>;
  visitBinding_NullLiteral(binding: ExtendedNullLiteral<TInputExtension>, arg: TArgument): ExtendedNode<TOutputExtension>;
  visitBinding_Identifier(binding: ExtendedIdentifier<TInputExtension>, arg: TArgument): ExtendedNode<TOutputExtension>;
}

export abstract class AbstractSyntaxTreeFolder<
  TArgument,
  TInputExtension,
  TOutputExtension
  > implements SyntaxTreeFolder<TArgument, TInputExtension, TOutputExtension>  {
  visitChunk(chunk: ExtendedChunk<TInputExtension>, arg: TArgument): ExtendedChunk<TOutputExtension> {
    if (chunk.kind === NodeKind.TextChunk) {
      return this.visitChunk_Text(chunk as ExtendedTextChunk<TInputExtension>, arg);
    } else {
      const chunkIn = chunk as ExtendedBindingChunk<TInputExtension>;
      const bindingOut = this.visitBinding(chunkIn.binding, arg);
      return this.visitChunk_Binding({
        ...chunkIn,
        binding: bindingOut
      }, arg);
    }
  }
  abstract visitChunk_Text(chunk: BaseTextChunk, arg: TArgument): ExtendedChunk<TOutputExtension>;
  abstract visitBinding(binding: ExtendedNode<TInputExtension>, arg: TArgument): ExtendedNode<TOutputExtension>;
  abstract visitChunk_Binding(chunk: BaseBindingChunk<TOutputExtension>, arg: TArgument): ExtendedBindingChunk<TOutputExtension>;

  abstract visitBinding_UnitAnnotation(annotation: BaseUnitAnnotation<TOutputExtension>, arg: TArgument): ExtendedNode<TOutputExtension>;
  abstract visitBinding_Property(property: BasePropertyAccess<TOutputExtension>, arg: TArgument): ExtendedNode<TOutputExtension>;
  abstract visitBinding_FunctionCall(functionCall: BaseFunctionCall<TOutputExtension>, arg: TArgument): ExtendedNode<TOutputExtension>;

  abstract visitBinding_StringLiteral(binding: ExtendedStringLiteral<TInputExtension>, arg: TArgument): ExtendedNode<TOutputExtension>;
  abstract visitBinding_NumberLiteral(binding: ExtendedNumberLiteral<TInputExtension>, arg: TArgument): ExtendedNode<TOutputExtension>;
  abstract visitBinding_BooleanLiteral(binding: ExtendedBooleanLiteral<TInputExtension>, arg: TArgument): ExtendedNode<TOutputExtension>;
  abstract visitBinding_NullLiteral(binding: ExtendedNullLiteral<TInputExtension>, arg: TArgument): ExtendedNode<TOutputExtension>;
  abstract visitBinding_Identifier(binding: ExtendedIdentifier<TInputExtension>, arg: TArgument): ExtendedNode<TOutputExtension>;
}

export function createFold<
  TArgument,
  TInputExtension,
  TOutputExtension
>
  (
    folder: SyntaxTreeFolder<TArgument, TInputExtension, TOutputExtension>
  ) {
  return (sequence: ExtendedChunk<TInputExtension>[], argument: TArgument): ExtendedChunk<TOutputExtension>[] => {
    return sequence.map(ch => folder.visitChunk(ch, argument));
  }
}