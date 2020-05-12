import { parse } from "../parser/parse";
import { getTokenName } from "../parser/Tokens";
import { Token } from "antlr4ts";
import { AbstractSyntaxTreeFolder, SyntaxTreeFolder } from "../ast/fold";
import { LocatableExtension } from "../ast/RangeExtensions";
import { ExtendedBindingExpression, BindingChunk, BaseUnitAnnotation, BasePropertyAccess, BaseFunctionCall, ExtendedStringLiteral, ExtendedNumberLiteral, ExtendedBooleanLiteral, ExtendedNullLiteral, ExtendedIdentifier } from "../ast/SyntaxTree";

const createTokenSpan = (content: string, tokenType: number) => {
  const span = document.createElement("span");
  span.setAttribute("class", "token-" + getTokenName(tokenType));
  span.textContent = content;
  return span;
}

const createNodeSpan = (content: HTMLElement[], ruleName: string) => {
  const span = document.createElement("span");
  span.setAttribute("class", "rule-" + ruleName);
  content.forEach(e => span.appendChild(e));
  return span;
}

interface ResultExtension {
  node: HTMLElement;
}

class CreateSpansFolder
  extends AbstractSyntaxTreeFolder<HTMLElement, LocatableExtension, ResultExtension>
  implements SyntaxTreeFolder<HTMLElement, LocatableExtension, ResultExtension> {
  visitBinding(binding: ExtendedBindingExpression<LocatableExtension>, arg: HTMLElement): ExtendedBindingExpression<ResultExtension> {
    throw new Error("Method not implemented.");
  }
  visitChunk_Binding(chunk: BindingChunk<ResultExtension>, arg: HTMLElement): BindingChunk<ResultExtension> {
    throw new Error("Method not implemented.");
  }
  visitBinding_UnitAnnotation(annotation: BaseUnitAnnotation<ResultExtension>, arg: HTMLElement): ExtendedBindingExpression<ResultExtension> {
    throw new Error("Method not implemented.");
  }
  visitBinding_Property(property: BasePropertyAccess<ResultExtension>, arg: HTMLElement): ExtendedBindingExpression<ResultExtension> {
    throw new Error("Method not implemented.");
  }
  visitBinding_FunctionCall(functionCall: BaseFunctionCall<ResultExtension>, arg: HTMLElement): ExtendedBindingExpression<ResultExtension> {
    throw new Error("Method not implemented.");
  }
  visitBinding_StringLiteral(binding: ExtendedStringLiteral<LocatableExtension>, arg: HTMLElement): ExtendedBindingExpression<ResultExtension> {
    throw new Error("Method not implemented.");
  }
  visitBinding_NumberLiteral(binding: ExtendedNumberLiteral<LocatableExtension>, arg: HTMLElement): ExtendedBindingExpression<ResultExtension> {
    throw new Error("Method not implemented.");
  }
  visitBinding_BooleanLiteral(binding: ExtendedBooleanLiteral<LocatableExtension>, arg: HTMLElement): ExtendedBindingExpression<ResultExtension> {
    throw new Error("Method not implemented.");
  }
  visitBinding_NullLiteral(binding: ExtendedNullLiteral<LocatableExtension>, arg: HTMLElement): ExtendedBindingExpression<ResultExtension> {
    throw new Error("Method not implemented.");
  }
  visitBinding_Identifier(binding: ExtendedIdentifier<LocatableExtension>, arg: HTMLElement): ExtendedBindingExpression<ResultExtension> {
    throw new Error("Method not implemented.");
  }
}

export function highlight(dom: HTMLElement, input: string): void {
  const { tokens } = parse(input);
  const spans = new Map<Token, HTMLSpanElement>();
  tokens.forEach(tk => spans.set(tk, createTokenSpan(tk.text!, tk.type)));
  spans.forEach(sp => dom.appendChild(sp));
  //const folder = new CreateSpansFolder();
  //model.forEach(ch => folder.visitChunk(ch, dom));
}