import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor";
import { BindingLanguageParserVisitor } from "../parser/generated/BindingLanguageParserVisitor";
import { BindingExpression } from "../ast/SyntaxTree";
import { PropertyContext, FunctionCallContext, ParametersContext } from "../parser/generated/BindingLanguageParser";
import { LocatableExpressionVisitor, LocatableExpression } from "./BindingExpressionVisitor";
import { LocatableFunctionCall, LocatablePropertyAccess } from "../ast/TokenExtensions";
import { ExpressionKind } from "../ast/ExpressionKind";

export enum MemberAccessKind {
  Property,
  FunctionCall
}

export interface MemberAccess {
  kind: MemberAccessKind,
  payload: string | BindingExpression[];
  locations: LocatablePropertyAccess | LocatableFunctionCall;
}

export class TailVisitor extends AbstractParseTreeVisitor<MemberAccess[]> implements BindingLanguageParserVisitor<MemberAccess[]> {
  private expressionVisitor: LocatableExpressionVisitor;
  constructor(expressionVisitor: LocatableExpressionVisitor) {
    super();
    this.expressionVisitor = expressionVisitor;
  }
  protected defaultResult(): MemberAccess[] {
    return [];
  }
  visitProperty = (ctx: PropertyContext) => {
    const tail = ctx._next != null ? this.visit(ctx._next) : [];
    return [{
      kind: MemberAccessKind.Property,
      payload: ctx._name.text,
      locations: {
        kind: ExpressionKind.PropertyAccess,
        tokenDot: ctx._dot,
        tokenId: ctx._name,
        tokenStart: ctx._start,
        tokenStop: ctx._stop
      }
    } as MemberAccess].concat(tail);
  };

  visitFunctionCall = (ctx: FunctionCallContext) => {
    const tail = ctx._next != null ? this.visit(ctx._next) : [];
    const parameters = ctx._list != null ? this.visitCustomParameters(ctx._list) : [];
    return [{
      kind: MemberAccessKind.FunctionCall,
      payload: parameters,
      locations: {
        kind: ExpressionKind.FunctionCall,
        tokenLeftParenthesis: ctx._lparen,
        tokenRightParenthesis: ctx._rparen,
        tokenStart: ctx._start,
        tokenStop: ctx._stop ?? ctx._start
      }
    } as MemberAccess].concat(tail);
  };

  visitCustomParameters(ctx: ParametersContext): LocatableExpression[] {
    const lhs = [this.expressionVisitor.visit(ctx._lhs)];
    const rhs = ctx._rhs != null ? this.visitCustomParameters(ctx._rhs) : [];
    return lhs.concat(rhs);
  }
}