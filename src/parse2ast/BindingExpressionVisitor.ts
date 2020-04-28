import { BindingLanguageParserVisitor } from "../parser/generated/BindingLanguageParserVisitor";
import { PropertyAccess, NumberLiteral, BooleanLiteral, BindingExpression, BindingExpressionKind, Unit, StringLiteral, UnitAnnotation, NullLiteral, FunctionCall } from "../ast/SyntaxTree";
import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor";
import { IdExpressionContext, NumberLiteralContext, StringLiteralContext, ParameterContext, BindingContext, BindingExpressionContext } from "../parser/generated/BindingLanguageParser";
import { TailVisitor, MemberAccessKind } from "./TailVisitor";
import { newIdentifier, newNumber, newNull, newString, newBoolean, newUnitAnnotation, newPropertyAccess, newFunctionCall } from "../ast/SyntaxTreeBuilder";

export class BindingExpressionVisitor extends AbstractParseTreeVisitor<BindingExpression> implements BindingLanguageParserVisitor<BindingExpression> {
  private tailVisitor = new TailVisitor(this);

  visitIdExpression = (ctx: IdExpressionContext) => {
    const tail = ctx._next != null ? this.tailVisitor.visit(ctx._next) : [];
    const leaf = newIdentifier(ctx._name.text!);
    return tail.reduce<BindingExpression>((lhs, rhs) => {
      const kind = rhs.kind === MemberAccessKind.Property
        ? BindingExpressionKind.PropertyAccess
        : BindingExpressionKind.FunctionCall;
      const operand = lhs;
      if (kind === BindingExpressionKind.PropertyAccess) {
        return newPropertyAccess(operand, rhs.payload as string);
      } else {
        return newFunctionCall(operand, rhs.payload as BindingExpression[]);
      }
    }, leaf);
  };

  visitNumberLiteral = (ctx: NumberLiteralContext) => newNumber(parseFloat(ctx._value.text!));

  visitStringLiteral = (ctx: StringLiteralContext) => newString(
    ctx._value.text!
      .substr(1, ctx._value.text!.length - 2)
      .replace("\\\\", "\\")
      .replace("\\\"", "\"")
  );

  visitTrueLiteral = () => newBoolean(true);

  visitFalseLiteral = () => newBoolean(false);

  visitNullLiteral = () => newNull();

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
    return newUnitAnnotation(operand, unit);
  };

  visitParameter = (ctx: ParameterContext) => this.visit(ctx.bindingExpression());

  protected defaultResult(): BindingExpression {
    return {
      kind: BindingExpressionKind.String,
      value: ""
    } as StringLiteral<BindingExpression>;
  }
}