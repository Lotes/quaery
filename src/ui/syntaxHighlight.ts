import { parse } from "../parser/parse";
import { getTokenName } from "../parser/Tokens";
import { Token } from "antlr4ts";
import { AbstractSyntaxTreeFolder, SyntaxTreeFolder } from "../ast/fold";
import { LocatableExtension, LocatablePropertyAccess, LocatableUnitAnnotation, LocatableFunctionCall, LocatableBindingChunk, LocatableTextChunk, LocatableExtensionBase } from "../ast/TokenExtensions";
import { ExtendedNode, BaseUnitAnnotation, BasePropertyAccess, BaseFunctionCall, ExtendedStringLiteral, ExtendedNumberLiteral, ExtendedBooleanLiteral, ExtendedNullLiteral, ExtendedIdentifier, ExtendedPropertyAccess, ExtendedUnitAnnotation, ExtendedFunctionCall, ExtendedBindingChunk, BaseBindingChunk, BaseTextChunk, ExtendedChunk } from "../ast/SyntaxTree";
import { Rule } from "../parser/Rules";
import { NodeKind } from "../ast/NodeKind";
import { LocationKind } from "../errors/SyntaxError";

const createTokenSpan = (content: string, tokenType: number) => {
  const span = document.createElement("span");
  span.setAttribute("class", "token-" + getTokenName(tokenType));
  span.textContent = content;
  return span;
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

type TokenTree = TokenNode | Token;

interface TokenNode {
  name: string;
  children: TokenTree[];
}

function isTokenNode(tree: TokenTree) {
  return "children" in tree && "name" in tree;
}

interface ResultExtension {
  node: TokenTree;
}

class TokenTreeFolder
  extends AbstractSyntaxTreeFolder<{}, LocatableExtension, LocatableExtension & ResultExtension>
  implements SyntaxTreeFolder<{}, LocatableExtension, LocatableExtension & ResultExtension> {

  private tokens: Token[];

  constructor(tokens: Token[]) {
    super();
    this.tokens = tokens;
  }

  getTokenTreeRange(tree: TokenTree): [number, number] {
    if (isTokenNode(tree)) {
      const node = tree as TokenNode;
      const left = this.getTokenTreeRange(node.children[0]);
      const right = this.getTokenTreeRange(node.children[node.children.length - 1]);
      return [left[0], right[1]];
    } else {
      const token = tree as Token;
      return [token.tokenIndex, token.tokenIndex];
    }
  }

  createTokenTree(name: string, children: TokenTree[], locatable: LocatableExtensionBase): TokenTree {
    if (children.length === 1) {
      return children[0];
    } else {
      return {
        name,
        children: this.addHiddenTokens(children, locatable)
      };
    }
  }

  addHiddenTokens(children: TokenTree[], locatable: LocatableExtensionBase): TokenTree[] {
    const result: TokenTree[] = [];
    const startIndex = locatable.tokenStart.tokenIndex;
    const stopIndex = locatable.tokenStop.tokenIndex;
    let tokenIndex = startIndex;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];
      const [left, right] = this.getTokenTreeRange(child);
      while (tokenIndex < left) {
        result.push(this.tokens[tokenIndex]);
        tokenIndex++;
      }
      result.push(child);
      tokenIndex = right;
    }
    while (tokenIndex <= stopIndex) {
      result.push(this.tokens[tokenIndex]);
      tokenIndex++;
    }
    return result;
  }

  visitChunk_Text(chunk: BaseTextChunk, arg: {}): ExtendedChunk<LocatableExtension & ResultExtension> {
    const locatable = chunk as unknown as LocatableTextChunk;
    return {
      ...locatable,
      ...chunk,
      node: this.createTokenTree(Rule.TextChunk, [locatable.tokenStart], locatable)
    }
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
        const processed: BasePropertyAccess<LocatableExtension & ResultExtension> = {
          ...unprocessed,
          operand
        };
        return this.visitBinding_Property(processed, arg);
      }
      case NodeKind.UnitAnnotation: {
        const unprocessed = binding as ExtendedUnitAnnotation<LocatableUnitAnnotation>;
        const operand = this.visitBinding(unprocessed.operand, arg);
        const processed: BaseUnitAnnotation<LocatableExtension & ResultExtension> = {
          ...unprocessed,
          operand
        }
        return this.visitBinding_UnitAnnotation(processed, arg);
      }
      case NodeKind.FunctionCall: {
        const unprocessed = binding as ExtendedFunctionCall<LocatableFunctionCall>;
        const operand = this.visitBinding(unprocessed.operand, arg);
        const actualParameters = unprocessed.actualParameters.map(p => this.visitBinding(p, arg));
        const processed = {
          ...binding,
          actualParameters,
          operand
        };
        return this.visitBinding_FunctionCall(processed, arg);
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
      node: this.createTokenTree(Rule.BindingChunk, [locatable.tokenLeftMustache, chunk.binding.node, locatable.tokenRightMustache], locatable),
    };
  }

  visitBinding_UnitAnnotation(annotation: BaseUnitAnnotation<LocatableExtension & ResultExtension>, arg: {}): ExtendedNode<LocatableExtension & ResultExtension> {
    const operand = annotation.operand;
    const locatable = annotation as unknown as LocatableUnitAnnotation;
    return {
      ...locatable,
      ...annotation,
      node: this.createTokenTree(Rule.UnitAnnotation, [operand.node, locatable.tokenUnit], locatable)
    };
  }
  visitBinding_Property(property: BasePropertyAccess<LocatableExtension & ResultExtension>, arg: {}): ExtendedNode<LocatableExtension & ResultExtension> {
    const operand = property.operand;
    const locatable = property as unknown as LocatablePropertyAccess;
    return {
      ...locatable,
      ...property,
      node: this.createTokenTree(Rule.PropertyAccess, [operand.node, locatable.tokenDot, locatable.tokenId], locatable)
    }
  }
  visitBinding_FunctionCall(functionCall: BaseFunctionCall<LocatableExtension & ResultExtension>, arg: {}): ExtendedNode<LocatableExtension & ResultExtension> {
    const operand = functionCall.operand;
    const actualParameters = functionCall.actualParameters;
    const locatable = functionCall as unknown as LocatableFunctionCall;
    debugger
    return {
      ...locatable,
      ...functionCall,
      node: this.createTokenTree(Rule.FunctionCall, [operand.node, locatable.tokenLeftParenthesis].concat(join(actualParameters.map(p => p.node), locatable.tokenCommas)).concat([locatable.tokenRightParenthesis]), locatable)
    };
  }
  visitBinding_StringLiteral(binding: ExtendedStringLiteral<LocatableExtension>, arg: {}): ExtendedNode<LocatableExtension & ResultExtension> {
    return {
      ...binding,
      node: this.createTokenTree(Rule.StringLiteral, [binding.tokenStart], binding)
    };
  }
  visitBinding_NumberLiteral(binding: ExtendedNumberLiteral<LocatableExtension>, arg: {}): ExtendedNode<LocatableExtension & ResultExtension> {
    return {
      ...binding,
      node: this.createTokenTree(Rule.NumberLiteral, [binding.tokenStart], binding)
    };
  }
  visitBinding_BooleanLiteral(binding: ExtendedBooleanLiteral<LocatableExtension>, arg: {}): ExtendedNode<LocatableExtension & ResultExtension> {
    return {
      ...binding,
      node: this.createTokenTree(Rule.BooleanLiteral, [binding.tokenStart], binding)
    };
  }
  visitBinding_NullLiteral(binding: ExtendedNullLiteral<LocatableExtension>, arg: {}): ExtendedNode<LocatableExtension & ResultExtension> {
    return {
      ...binding,
      node: this.createTokenTree(Rule.NullLiteral, [binding.tokenStart], binding)
    };
  }
  visitBinding_Identifier(binding: ExtendedIdentifier<LocatableExtension>, arg: {}): ExtendedNode<LocatableExtension & ResultExtension> {
    return {
      ...binding,
      node: this.createTokenTree(Rule.Identifier, [binding.tokenStart], binding)
    };
  }
}

function toHTML(spans: Map<number, HTMLElement>, tree: TokenTree): HTMLElement {
  if (isTokenNode(tree)) {
    const node = tree as TokenNode;
    const span = document.createElement("span");
    node.children
      .map(t => toHTML(spans, t))
      .forEach(html => span.appendChild(html));
    span.setAttribute("class", "rule-" + node.name);
    return span;
  } else {
    const token = tree as Token;
    const span = spans.get(token.tokenIndex)!;
    return span;
  }
}

export function highlight(dom: HTMLElement, input: string): void {
  const { tokens, lexerErrors, parserErrors, model } = parse(input);
  const spans = new Map<number, HTMLElement>();
  tokens.forEach(tk => spans.set(tk.tokenIndex, createTokenSpan(tk.text!, tk.type)));
  if (lexerErrors.length > 0 || parserErrors.length > 0) {
    spans.forEach(span => dom.appendChild(span))

    lexerErrors.concat(parserErrors).forEach(error => {
      let startIndex: number;
      let stopIndex: number;
      switch (error.location.kind) {
        case LocationKind.Offset: {
          const startOffset = error.location.start as number;
          const stopOffset = error.location.stop as number;
          startIndex = tokens.findIndex(tk => tk.startIndex <= startOffset);
          stopIndex = tokens.findIndex(tk => stopOffset <= tk.stopIndex);
          break;
        }
        case LocationKind.Token: {
          startIndex = (error.location.start as Token)!.tokenIndex;
          stopIndex = (error.location.stop as Token)!.tokenIndex;
          break;
        }
      }
      for (let index = startIndex; index <= stopIndex; index++) {
        const span = spans.get(index)!;
        const value = span.getAttribute("class");
        span.setAttribute("class", value + " error");
      }
    });
    return;
  }

  const folder = new TokenTreeFolder(tokens);
  model!
    .map(ch => folder.visitChunk(ch, spans).node)
    .forEach(ch => dom.appendChild(toHTML(spans, ch)))
    ;
}