import { ChunkSequence, BindingExpression, UnitAnnotationPayload, PropertyExpressionPayload, FunctionCallExpressionPayload } from "./SyntaxTree";

export interface SyntaxTreeVisitor<TArgument, TBinding = void, TChunk = void> {
  visitChunk_Text(text: string, arg: TArgument): TChunk;
  visitChunk_Binding(binding: BindingExpression, arg: TArgument): TChunk;
  visitBinding_UnitAnnotation(annotation: UnitAnnotationPayload, arg: TArgument): TBinding;
  visitBinding_StringLiteral(value: string, arg: TArgument): TBinding;
  visitBinding_NumberLiteral(value: number, arg: TArgument): TBinding;
  visitBinding_BooleanLiteral(value: boolean, arg: TArgument): TBinding;
  visitBinding_NullLiteral(arg: TArgument): TBinding;
  visitBinding_Identifier(identifier: string, arg: TArgument): TBinding;
  visitBinding_Property(property: PropertyExpressionPayload, arg: TArgument): TBinding;
  visitBinding_FunctionCall(functionCall: FunctionCallExpressionPayload, arg: TArgument): TBinding;
}

export function accept<TArgument, TBinding = void, TChunk = void>(sequence: ChunkSequence, visitor: SyntaxTreeVisitor<TArgument, TBinding, TChunk>) {
  //TODO
};