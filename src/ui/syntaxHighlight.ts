import { parse } from "../parser/parse";
import { getTokenName } from "../parser/Tokens";
import { Token } from "antlr4ts";
import { AbstractSyntaxTreeFolder, SyntaxTreeFolder } from "../ast/fold";
import { LocatableExtension, LocatablePropertyAccess, LocatableUnitAnnotation, LocatableFunctionCall } from "../ast/TokenExtensions";
import { ExtendedBindingExpression, BindingChunk, BaseUnitAnnotation, BasePropertyAccess, BaseFunctionCall, ExtendedStringLiteral, ExtendedNumberLiteral, ExtendedBooleanLiteral, ExtendedNullLiteral, ExtendedIdentifier, ChunkKind, TextChunk, ExtendedPropertyAccess, ExtendedUnitAnnotation, ExtendedFunctionCall } from "../ast/SyntaxTree";
import { Rule } from "../parser/Rules";
import { ExpressionKind } from "../ast/ExpressionKind";
import { BindingLanguageLexer } from "../parser/generated/BindingLanguageLexer";

const createTokenSpan = (content: string, tokenType: number) => {
  const span = document.createElement("span");
  span.setAttribute("class", "token-" + getTokenName(tokenType));
  span.textContent = content;
  return span;
}

const createNodeSpan = (content: HTMLElement[], ruleName: string) => {
  const span = document.createElement("span");
  span.setAttribute("class", "rule-" + ruleName);
  content.forEach(e => e && span.appendChild(e));
  return span as HTMLElement;
}

function join<T>(operands: T[], operators: T[]): T[] {
  if (operands.length === 0) {
    return [];
  }
  if (operands.length !== operators.length + 1) {
    throw new Error("Forbidden join usage!");
  }
  const result = [operands[0]];
  operators.forEach((op, index) => {
    result.push(op);
    result.push(operands[index + 1]);
  });
  return result;
}

interface ResultExtension {
  node: HTMLElement;
}

class CreateSpansFolder
  extends AbstractSyntaxTreeFolder<{}, LocatableExtension, ResultExtension>
  implements SyntaxTreeFolder<{}, LocatableExtension, ResultExtension> {
  private tokenMap: Map<number, HTMLElement>;
  constructor(tokens: Token[], tokenMap: Map<number, HTMLElement>) {
    super();
    this.tokenMap = tokenMap;
  }
  getSpanOfToken(token: Token): HTMLElement {
    return this.tokenMap.get(token.tokenIndex)!;
  }
  visitBinding(binding: ExtendedBindingExpression<LocatableExtension>, arg: {}): ExtendedBindingExpression<ResultExtension> {
    switch (binding.kind) {
      case ExpressionKind.Boolean: return this.visitBinding_BooleanLiteral(binding as ExtendedBooleanLiteral<LocatableExtension>, arg);
      case ExpressionKind.Identifier: return this.visitBinding_Identifier(binding as ExtendedIdentifier<LocatableExtension>, arg);
      case ExpressionKind.Null: return this.visitBinding_NullLiteral(binding as ExtendedNullLiteral<LocatableExtension>, arg);
      case ExpressionKind.Number: return this.visitBinding_NumberLiteral(binding as ExtendedNumberLiteral<LocatableExtension>, arg);
      case ExpressionKind.String: return this.visitBinding_StringLiteral(binding as ExtendedStringLiteral<LocatableExtension>, arg);
      case ExpressionKind.PropertyAccess: {
        const unprocessed = binding as ExtendedPropertyAccess<LocatablePropertyAccess>;
        const operand = this.visitBinding(unprocessed.operand, arg);
        const dotSpan = this.getSpanOfToken(unprocessed.tokenDot);
        const idSpan = this.getSpanOfToken(unprocessed.tokenId);
        const processed: ExtendedPropertyAccess<ResultExtension> = {
          ...unprocessed,
          operand,
          node: createNodeSpan([operand.node, dotSpan, idSpan], Rule.PropertyAccess)
        };
        return processed;
      }
      case ExpressionKind.UnitAnnotation: {
        const unprocessed = binding as ExtendedUnitAnnotation<LocatableUnitAnnotation>;
        const operand = this.visitBinding(unprocessed.operand, arg);
        const unitSpan = this.getSpanOfToken(unprocessed.tokenUnit);
        const processed: ExtendedUnitAnnotation<ResultExtension> = {
          ...unprocessed,
          operand,
          node: createNodeSpan([operand.node, unitSpan], Rule.UnitAnnotation)
        }
        return processed;
      }
      case ExpressionKind.FunctionCall: {
        const unprocessed = binding as ExtendedFunctionCall<LocatableFunctionCall>;
        const operand = this.visitBinding(unprocessed.operand, arg);
        const lparenSpan = this.getSpanOfToken(unprocessed.tokenLeftParenthesis);
        const rparenSpan = this.getSpanOfToken(unprocessed.tokenRightParenthesis);
        const commaSpans = unprocessed.tokenCommas.map(c => this.getSpanOfToken(c));
        const actualParameters = unprocessed.actualParameters.map(p => this.visitBinding(p, arg));
        const processed: ExtendedFunctionCall<ResultExtension> = {
          ...binding,
          actualParameters,
          operand,
          node: createNodeSpan([operand.node, lparenSpan].concat(join(actualParameters.map(p => p.node), commaSpans)).concat([rparenSpan]), Rule.FunctionCall)
        };
        return processed;
      }
    }
  }

  visitChunk_Binding(chunk: BindingChunk<ResultExtension>, arg: {}): BindingChunk<ResultExtension> {
    return chunk;
  }

  visitBinding_UnitAnnotation(annotation: BaseUnitAnnotation<ResultExtension>, arg: {}): ExtendedBindingExpression<ResultExtension> {
    throw new Error("Method not implemented.");
  }
  visitBinding_Property(property: BasePropertyAccess<ResultExtension>, arg: {}): ExtendedBindingExpression<ResultExtension> {
    throw new Error("Method not implemented.");
  }
  visitBinding_FunctionCall(functionCall: BaseFunctionCall<ResultExtension>, arg: {}): ExtendedBindingExpression<ResultExtension> {
    throw new Error("Method not implemented.");
  }
  visitBinding_StringLiteral(binding: ExtendedStringLiteral<LocatableExtension>, arg: {}): ExtendedBindingExpression<ResultExtension> {
    const span = this.getSpanOfToken(binding.tokenStart);
    return {
      ...binding,
      node: createNodeSpan([span], Rule.StringLiteral) as HTMLElement
    };
  }
  visitBinding_NumberLiteral(binding: ExtendedNumberLiteral<LocatableExtension>, arg: {}): ExtendedBindingExpression<ResultExtension> {
    const span = this.getSpanOfToken(binding.tokenStart);
    return {
      ...binding,
      node: createNodeSpan([span], Rule.NumberLiteral) as HTMLElement
    };
  }
  visitBinding_BooleanLiteral(binding: ExtendedBooleanLiteral<LocatableExtension>, arg: {}): ExtendedBindingExpression<ResultExtension> {
    const span = this.getSpanOfToken(binding.tokenStart);
    return {
      ...binding,
      node: createNodeSpan([span], Rule.BooleanLiteral) as HTMLElement
    };
  }
  visitBinding_NullLiteral(binding: ExtendedNullLiteral<LocatableExtension>, arg: {}): ExtendedBindingExpression<ResultExtension> {
    const span = this.getSpanOfToken(binding.tokenStart);
    return {
      ...binding,
      node: createNodeSpan([span], Rule.NullLiteral) as HTMLElement
    };
  }
  visitBinding_Identifier(binding: ExtendedIdentifier<LocatableExtension>, arg: {}): ExtendedBindingExpression<ResultExtension> {
    const span = this.getSpanOfToken(binding.tokenStart);
    return {
      ...binding,
      node: createNodeSpan([span], Rule.Identifier) as HTMLElement
    };
  }
}

export function highlight(dom: HTMLElement, input: string): void {
  const { tokens, model } = parse(input);
  const spans = new Map<number, HTMLElement>();
  tokens.forEach(tk => spans.set(tk.tokenIndex, createTokenSpan(tk.text!, tk.type)));
  const folder = new CreateSpansFolder(tokens, spans);
  model.forEach(ch => {
    const chunk = folder.visitChunk(ch, spans);
    switch (chunk.kind) {
      case ChunkKind.Binding: {
        const bindingChunk = chunk as BindingChunk<ResultExtension>;
        const node = bindingChunk.binding.node;
        dom.appendChild(createNodeSpan([node], Rule.BindingChunk));
        break;
      }
      case ChunkKind.Text: {
        const text = (chunk as TextChunk).text;
        dom.appendChild(createTokenSpan(text, BindingLanguageLexer.TEXT));
        break;
      }
    }
  });
}