import { SyntaxTreeFolder } from "../ast/fold";
import { Chunk } from "antlr4ts/tree/pattern/Chunk";
import { BindingExpression, BindingExpressionKind, ChunkKind } from "../ast/SyntaxTree";

export enum Type {
  String,
}

export interface TypedBindingExpression extends BindingExpression {
  type: Type;
}

export class CoerceTypesVisitor implements SyntaxTreeFolder<void, Chunk, TypedBindingExpression> {
  visitChunk_Text(text: string, arg: void): Chunk {
    return {
      kind: ChunkKind.Text,
      payload: text,
      type: Type.String
    };
  }
  visitChunk_Binding(binding: BindingExpression, arg: void): Chunk {
    throw new Error("Method not implemented.");
  }
  visitBinding_UnitAnnotation(annotation: import("../ast/SyntaxTree").UnitAnnotationPayload, arg: void): TypedBindingExpression {
    throw new Error("Method not implemented.");
  }
  visitBinding_StringLiteral(value: string, arg: void): TypedBindingExpression {
    throw new Error("Method not implemented.");
  }
  visitBinding_NumberLiteral(value: number, arg: void): TypedBindingExpression {
    throw new Error("Method not implemented.");
  }
  visitBinding_BooleanLiteral(value: boolean, arg: void): TypedBindingExpression {
    throw new Error("Method not implemented.");
  }
  visitBinding_NullLiteral(arg: void): TypedBindingExpression {
    throw new Error("Method not implemented.");
  }
  visitBinding_Identifier(identifier: string, arg: void): TypedBindingExpression {
    throw new Error("Method not implemented.");
  }
  visitBinding_Property(property: import("../ast/SyntaxTree").PropertyExpressionPayload, arg: void): TypedBindingExpression {
    throw new Error("Method not implemented.");
  }
  visitBinding_FunctionCall(functionCall: import("../ast/SyntaxTree").FunctionCallExpressionPayload, arg: void): TypedBindingExpression {
    throw new Error("Method not implemented.");
  }

}