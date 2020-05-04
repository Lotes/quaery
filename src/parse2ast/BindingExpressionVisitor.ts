import { BindingLanguageParserVisitor } from "../parser/generated/BindingLanguageParserVisitor";
import { Unit, ExtendedBindingExpression } from "../ast/SyntaxTree";
import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor";
import { IdExpressionContext, NumberLiteralContext, StringLiteralContext, ParameterContext, BindingContext, BindingExpressionContext, TrueLiteralContext, FalseLiteralContext, NullLiteralContext } from "../parser/generated/BindingLanguageParser";
import { TailVisitor, MemberAccessKind } from "./TailVisitor";
import { newIdentifier, newNumber, newNull, newString, newBoolean, newUnitAnnotation, newPropertyAccess, newFunctionCall, newRangeFromTokens } from "../ast/factory";
import { ExpressionKind } from "../ast/ExpressionKind";
import { LocatableExtension } from "../ast/RangeExtensions";

export type LocatableExpression = ExtendedBindingExpression<LocatableExtension>;

export class LocatableExpressionVisitor extends AbstractParseTreeVisitor<LocatableExpression> implements BindingLanguageParserVisitor<LocatableExpression> {
  private tailVisitor = new TailVisitor(this);

  visitIdExpression = (ctx: IdExpressionContext) => {
    const tail = ctx._next != null ? this.tailVisitor.visit(ctx._next) : [];
    const leaf = newIdentifier<LocatableExtension>(ctx._name.text!, {
      kind: ExpressionKind.Identifier,
      locationSelf: newRangeFromTokens(ctx._name)
    });
    return tail.reduce<LocatableExpression>((lhs, rhs) => {
      const kind = rhs.kind === MemberAccessKind.Property
        ? ExpressionKind.PropertyAccess
        : ExpressionKind.FunctionCall;
      const operand = lhs;
      if (kind === ExpressionKind.PropertyAccess) {
        return newPropertyAccess<LocatableExtension>(operand, rhs.payload as string, {
          ...rhs.locations,
          locationValue: operand.locationSelf
        });
      } else {
        return newFunctionCall<LocatableExtension>(operand, rhs.payload as LocatableExpression[], {
          ...rhs.locations,
          locationValue: operand.locationSelf
        });
      }
    }, leaf);
  };

  visitNumberLiteral = (ctx: NumberLiteralContext) => newNumber<LocatableExtension>(parseFloat(ctx._value.text!), {
    kind: ExpressionKind.Number,
    locationSelf: newRangeFromTokens(ctx._value)
  });

  visitStringLiteral = (ctx: StringLiteralContext) => newString<LocatableExtension>(
    ctx._value.text!
      .substr(1, ctx._value.text!.length - 2)
      .replace("\\\\", "\\")
      .replace("\\\"", "\""), {
    kind: ExpressionKind.String,
    locationSelf: newRangeFromTokens(ctx._value)
  });

  visitTrueLiteral = (ctx: TrueLiteralContext) => newBoolean<LocatableExtension>(true, {
    kind: ExpressionKind.Boolean,
    locationSelf: newRangeFromTokens(ctx._value)
  });

  visitFalseLiteral = (ctx: FalseLiteralContext) => newBoolean<LocatableExtension>(false, {
    kind: ExpressionKind.Boolean,
    locationSelf: newRangeFromTokens(ctx._value)
  });

  visitNullLiteral = (ctx: NullLiteralContext) => newNull<LocatableExtension>({
    kind: ExpressionKind.Boolean,
    locationSelf: newRangeFromTokens(ctx._value)
  });

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
    return newUnitAnnotation(operand, unit, {
      kind: ExpressionKind.UnitAnnotation,
      locationSelf: newRangeFromTokens(ctx._start, ctx._stop),
      locationUnit: newRangeFromTokens(ctx._unit),
      locationValue: operand.locationSelf
    });
  };

  visitParameter = (ctx: ParameterContext) => this.visit(ctx.bindingExpression());

  protected defaultResult(): LocatableExpression {
    return newString<LocatableExtension>("", {
      kind: ExpressionKind.String,
      locationSelf: {
        startIndex: -1,
        stopIndex: -1
      }
    });
  }
}