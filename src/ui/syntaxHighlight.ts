import { parse } from "../parser/parse";
import { getTokenName } from "../parser/Tokens";
import { Token } from "antlr4ts";
import { AbstractSyntaxTreeFolder, SyntaxTreeFolder } from "../ast/fold";
import { LocatableExtension, LocatablePropertyAccess, LocatableUnitAnnotation, LocatableFunctionCall, LocatableBindingChunk, LocatableTextChunk } from "../ast/TokenExtensions";
import { ExtendedNode, BaseUnitAnnotation, BasePropertyAccess, BaseFunctionCall, ExtendedStringLiteral, ExtendedNumberLiteral, ExtendedBooleanLiteral, ExtendedNullLiteral, ExtendedIdentifier, ExtendedPropertyAccess, ExtendedUnitAnnotation, ExtendedFunctionCall, ExtendedBindingChunk, ExtendedTextChunk, BaseBindingChunk, BaseTextChunk, ExtendedChunk } from "../ast/SyntaxTree";
import { Rule } from "../parser/Rules";
import { NodeKind } from "../ast/NodeKind";
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
  extends AbstractSyntaxTreeFolder<{}, LocatableExtension, LocatableExtension & ResultExtension>
  implements SyntaxTreeFolder<{}, LocatableExtension, LocatableExtension & ResultExtension> {
  visitChunk_Text(chunk: BaseTextChunk, arg: {}): ExtendedChunk<LocatableExtension & ResultExtension> {
    const locatable = chunk as unknown as LocatableTextChunk;
    return {
      ...locatable,
      ...chunk,
      node: createNodeSpan([], Rule.TextChunk)
    }
  }
  private tokenMap: Map<number, HTMLElement>;
  constructor(tokens: Token[], tokenMap: Map<number, HTMLElement>) {
    super();
    this.tokenMap = tokenMap;
  }
  getSpanOfToken(token: Token): HTMLElement {
    return this.tokenMap.get(token.tokenIndex)!;
  }
  visitBinding(binding: ExtendedNode<LocatableExtension>, arg: {}): ExtendedNode<LocatableExtension & ResultExtension> {
    switch (binding.kind) {
      case NodeKind.Boolean: return this.visitBinding_BooleanLiteral(binding as ExtendedBooleanLiteral<LocatableExtension>, arg);
      case NodeKind.Identifier: return this.visitBinding_Identifier(binding as ExtendedIdentifier<LocatableExtension>, arg);
      case NodeKind.Null: return this.visitBinding_NullLiteral(binding as ExtendedNullLiteral<LocatableExtension>, arg);
      case NodeKind.Number: return this.visitBinding_NumberLiteral(binding as ExtendedNumberLiteral<LocatableExtension>, arg);
      case NodeKind.String: return this.visitBinding_StringLiteral(binding as ExtendedStringLiteral<LocatableExtension>, arg);
      case NodeKind.PropertyAccess: {
        const unprocessed = binding as ExtendedPropertyAccess<LocatablePropertyAccess>;
        const operand = this.visitBinding(unprocessed.operand, arg);
        const dotSpan = this.getSpanOfToken(unprocessed.tokenDot);
        const idSpan = this.getSpanOfToken(unprocessed.tokenId);
        const processed: ExtendedPropertyAccess<LocatableExtension & ResultExtension> = {
          ...unprocessed,
          operand,
          node: createNodeSpan([operand.node, dotSpan, idSpan], Rule.PropertyAccess)
        };
        return processed;
      }
      case NodeKind.UnitAnnotation: {
        const unprocessed = binding as ExtendedUnitAnnotation<LocatableUnitAnnotation>;
        const operand = this.visitBinding(unprocessed.operand, arg);
        const unitSpan = this.getSpanOfToken(unprocessed.tokenUnit);
        const processed: ExtendedUnitAnnotation<LocatableExtension & ResultExtension> = {
          ...unprocessed,
          operand,
          node: createNodeSpan([operand.node, unitSpan], Rule.UnitAnnotation)
        }
        return processed;
      }
      case NodeKind.FunctionCall: {
        const unprocessed = binding as ExtendedFunctionCall<LocatableFunctionCall>;
        const operand = this.visitBinding(unprocessed.operand, arg);
        const lparenSpan = this.getSpanOfToken(unprocessed.tokenLeftParenthesis);
        const rparenSpan = this.getSpanOfToken(unprocessed.tokenRightParenthesis);
        const commaSpans = unprocessed.tokenCommas.map(c => this.getSpanOfToken(c));
        const actualParameters = unprocessed.actualParameters.map(p => this.visitBinding(p, arg));
        const processed: ExtendedFunctionCall<LocatableExtension & ResultExtension> = {
          ...binding,
          actualParameters,
          operand,
          node: createNodeSpan([operand.node, lparenSpan].concat(join(actualParameters.map(p => p.node), commaSpans)).concat([rparenSpan]), Rule.FunctionCall)
        };
        return processed;
      }
      default:
        throw new Error("Not implemented yet!");
    }
  }

  visitChunk_Binding(chunk: BaseBindingChunk<LocatableExtension & ResultExtension>, arg: {}): ExtendedBindingChunk<LocatableExtension & ResultExtension> {
    const locatable = chunk as unknown as LocatableBindingChunk;
    return {
      ...locatable,
      ...chunk,
      kind: NodeKind.BindingChunk,
      node: createNodeSpan([], Rule.BindingChunk),
    };
  }

  visitBinding_UnitAnnotation(annotation: BaseUnitAnnotation<LocatableExtension & ResultExtension>, arg: {}): ExtendedNode<LocatableExtension & ResultExtension> {
    throw new Error("Method not implemented.");
  }
  visitBinding_Property(property: BasePropertyAccess<LocatableExtension & ResultExtension>, arg: {}): ExtendedNode<LocatableExtension & ResultExtension> {
    throw new Error("Method not implemented.");
  }
  visitBinding_FunctionCall(functionCall: BaseFunctionCall<LocatableExtension & ResultExtension>, arg: {}): ExtendedNode<LocatableExtension & ResultExtension> {
    throw new Error("Method not implemented.");
  }
  visitBinding_StringLiteral(binding: ExtendedStringLiteral<LocatableExtension>, arg: {}): ExtendedNode<LocatableExtension & ResultExtension> {
    const span = this.getSpanOfToken(binding.tokenStart);
    return {
      ...binding,
      node: createNodeSpan([span], Rule.StringLiteral) as HTMLElement
    };
  }
  visitBinding_NumberLiteral(binding: ExtendedNumberLiteral<LocatableExtension>, arg: {}): ExtendedNode<LocatableExtension & ResultExtension> {
    const span = this.getSpanOfToken(binding.tokenStart);
    return {
      ...binding,
      node: createNodeSpan([span], Rule.NumberLiteral) as HTMLElement
    };
  }
  visitBinding_BooleanLiteral(binding: ExtendedBooleanLiteral<LocatableExtension>, arg: {}): ExtendedNode<LocatableExtension & ResultExtension> {
    const span = this.getSpanOfToken(binding.tokenStart);
    return {
      ...binding,
      node: createNodeSpan([span], Rule.BooleanLiteral) as HTMLElement
    };
  }
  visitBinding_NullLiteral(binding: ExtendedNullLiteral<LocatableExtension>, arg: {}): ExtendedNode<LocatableExtension & ResultExtension> {
    const span = this.getSpanOfToken(binding.tokenStart);
    return {
      ...binding,
      node: createNodeSpan([span], Rule.NullLiteral) as HTMLElement
    };
  }
  visitBinding_Identifier(binding: ExtendedIdentifier<LocatableExtension>, arg: {}): ExtendedNode<LocatableExtension & ResultExtension> {
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
      case NodeKind.BindingChunk: {
        const bindingChunk = chunk as ExtendedBindingChunk<LocatableExtension & ResultExtension>;
        const node = bindingChunk.binding.node;
        dom.appendChild(createNodeSpan([node], Rule.BindingChunk));
        break;
      }
      case NodeKind.TextChunk: {
        const text = (chunk as ExtendedTextChunk<LocatableExtension & ResultExtension>).text;
        dom.appendChild(createTokenSpan(text, BindingLanguageLexer.TEXT));
        break;
      }
    }
  });
}