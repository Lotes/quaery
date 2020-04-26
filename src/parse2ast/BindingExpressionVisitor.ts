import { BindingLanguageParserVisitor } from "../parser/generated/BindingLanguageParserVisitor";
import { BindingExpression, BindingExpressionKind, UnitAnnotationPayload, Unit } from "../ast/SyntaxTree";
import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor";
import { IdExpressionContext, NumberLiteralContext, StringLiteralContext, ParameterContext, BindingContext, BindingExpressionContext } from "../parser/generated/BindingLanguageParser";
import { BindingLanguageLexer } from "../parser/generated/BindingLanguageLexer";

export class BindingExpressionVisitor extends AbstractParseTreeVisitor<BindingExpression> implements BindingLanguageParserVisitor<BindingExpression> {
  visitIdExpression = (ctx: IdExpressionContext) => ({
    kind: BindingExpressionKind.Identifier,
    payload: ctx._name.text
  } as BindingExpression);

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

  // visitPropertyTail?: ((ctx: PropertyTailContext) => BindingExpression) | undefined;
  // visitFunctionCallTail?: ((ctx: FunctionCallTailContext) => BindingExpression) | undefined;

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