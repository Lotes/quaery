import { createParsingEnvironmentFor } from "../parser/parse";
import { getTokenName } from "../parser/Tokens";
import { Token } from "antlr4ts";

export function highlight(dom: HTMLElement, input: string) {
  const { lexer, parser, errors } = createParsingEnvironmentFor(input);

  const createSpan = (content: string, tokenType: number) => {
    const span = document.createElement("span");
    span.setAttribute("class", "token-" + getTokenName(tokenType));
    span.textContent = content;
    return span;
  }

  const spans = new Map<Token, HTMLSpanElement>();
  lexer.getAllTokens().forEach(tk => spans.set(tk, createSpan(tk.text!, tk.type)));

  for (let key of spans.keys()) {
    const value = spans.get(key);
    dom.appendChild(value!);
  }
}