import { BindingLanguageParserVisitor } from "../parser/generated/BindingLanguageParserVisitor";
import { BindingExpression, BindingExpressionKind, UnitAnnotationPayload, Unit } from "../ast/SyntaxTree";
import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor";
import { IdExpressionContext, NumberLiteralContext, StringLiteralContext, ParameterContext, BindingContext, BindingExpressionContext } from "../parser/generated/BindingLanguageParser";
import { TailVisitor, MemberAccessKind } from "./TailVisitor";

export class BindingExpressionVisitor extends AbstractParseTreeVisitor<BindingExpression> implements BindingLanguageParserVisitor<BindingExpression> {
  private tailVisitor = new TailVisitor(this);

  visitIdExpression = (ctx: IdExpressionContext) => {
    const tail = ctx._next != null ? this.tailVisitor.visit(ctx._next) : [];
    const leaf: BindingExpression = {
      kind: BindingExpressionKind.Identifier,
      payload: ctx._name.text!
    };
    return tail.reduce((lhs, rhs) => {
      const kind = rhs.kind === MemberAccessKind.Property
        ? BindingExpressionKind.PropertyAccess
        : BindingExpressionKind.FunctionCall;
      const operand = lhs;
      if (kind === BindingExpressionKind.PropertyAccess) {
        return {
          kind,
          payload: {
            operand,
            propertyName: rhs.payload as string
          }
        } as BindingExpression;
      } else {
        return {
          kind,
          payload: {
            operand,
            parameters: rhs.payload as BindingExpression[]
          }
        } as BindingExpression;
      }
    }, leaf);
  };

  visitNumberLiteral = (ctx: NumberLiteralContext) => ({
    kind: BindingExpressionKind.Number,
    payload: parseFloat(ctx._value.text!)
  } as BindingExpression);

  visitStringLiteral = (ctx: StringLiteralContext) => ({
    kind: BindingExpressionKind.String,
    payload: ctx._value.text!
      .substr(1, ctx._value.text!.length - 2)
      .replace("\\\\", "\\")
      .replace("\\\"", "\"")
  } as BindingExpression);

  visitTrueLiteral = () => ({
    kind: BindingExpressionKind.Boolean,
    payload: true
  } as BindingExpression);

  visitFalseLiteral = () => ({
    kind: BindingExpressionKind.Boolean,
    payload: false
  } as BindingExpression);

  visitNullLiteral = () => ({
    kind: BindingExpressionKind.Null,
    payload: null
  } as BindingExpression);

  visitBinding = (ctx: BindingContext) => this.visit(ctx.bindingExpression());

  visitBindingExpression = (ctx: BindingExpressionContext) => {
    let unit: Unit;
    const operand = this.visit(ctx._value);
    switch (ctx._unit?.text) {
      case "px": unit = Unit.Pixels; break;
      case "cm": unit = Unit.Centimeter; break;
      case "mm": unit = Unit.Millimeter; break;
      case "inch": unit = Unit.Inch; break;
      case "pt": unit = Unit.Points; break;
      default:
        return operand;
    }
    return ({
      kind: BindingExpressionKind.UnitAnnotation,
      payload: {
        operand,
        unit
      } as UnitAnnotationPayload
    } as BindingExpression);
  };

  // visitProperty?: ((ctx: PropertyContext) => BindingExpression) | undefined;
  // visitFunctionCall?: ((ctx: FunctionCallContext) => BindingExpression) | undefined;
  // visitParameters?: ((ctx: ParametersContext) => BindingExpression) | undefined;

  visitParameter = (ctx: ParameterContext) => this.visit(ctx.bindingExpression());

  protected defaultResult(): BindingExpression {
    return {
      kind: BindingExpressionKind.String,
      payload: ""
    };
  }
}