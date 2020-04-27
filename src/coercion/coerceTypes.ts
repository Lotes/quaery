import { BindingExpression, Chunk, UnitAnnotationPayload, PropertyExpressionPayload, FunctionCallExpressionPayload, GenericBindingExpression, ChunkKind, BindingExpressionKind } from "../ast/SyntaxTree";
import { Type, TypeChecker } from "../typesystem/TypeSystem";
import { createFold, AbstractSyntaxTreeFolder } from "../ast/fold";

export interface TypedBindingExpression extends GenericBindingExpression<TypedBindingExpression> {
  type: Type;
}

class CoercionFolder extends AbstractSyntaxTreeFolder<TypeChecker, BindingExpression, TypedBindingExpression> {
  visitChunk_Binding(binding: TypedBindingExpression, arg: TypeChecker): Chunk<TypedBindingExpression> {
    throw new Error("Method not implemented.");
  }
  visitBinding_UnitAnnotation(annotation: UnitAnnotationPayload<TypedBindingExpression>, arg: TypeChecker): TypedBindingExpression {
    throw new Error("Method not implemented.");
  }
  visitBinding_Property(property: PropertyExpressionPayload<TypedBindingExpression>, arg: TypeChecker): TypedBindingExpression {
    throw new Error("Method not implemented.");
  }
  visitBinding_FunctionCall(functionCall: FunctionCallExpressionPayload<TypedBindingExpression>, arg: TypeChecker): TypedBindingExpression {
    throw new Error("Method not implemented.");
  }
  visitBinding_StringLiteral(value: string, arg: TypeChecker): TypedBindingExpression {
    throw new Error("Method not implemented.");
  }
  visitBinding_NumberLiteral(value: number, arg: TypeChecker): TypedBindingExpression {
    throw new Error("Method not implemented.");
  }
  visitBinding_BooleanLiteral(value: boolean, arg: TypeChecker): TypedBindingExpression {
    throw new Error("Method not implemented.");
  }
  visitBinding_NullLiteral(arg: TypeChecker): TypedBindingExpression {
    throw new Error("Method not implemented.");
  }
  visitBinding_Identifier(identifier: string, arg: TypeChecker): TypedBindingExpression {
    throw new Error("Method not implemented.");
  }
}

createFold<TypeChecker, BindingExpression, TypedBindingExpression>(new CoercionFolder())