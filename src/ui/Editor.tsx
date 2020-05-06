import React, { Component, createRef } from 'react';
import './Editor.css';
import { BindingLanguageLexer } from '../parser/generated/BindingLanguageLexer';
import { ANTLRInputStream } from 'antlr4ts';
import { getTokenName } from '../parser/Tokens';

export enum Direction {
  Left,
  Right
}

export interface Cursor {
  start: number;
  end: number;
  direction?: Direction;
}

export interface EditorProps {
  text: string;
  textChanged: (newText: string) => void;
}

const regexLineBreak = /(\r\n?|\n)/g;

export class Editor extends Component<EditorProps> {
  private dom: React.RefObject<HTMLDivElement>;
  constructor(props: EditorProps) {
    super(props);
    this.dom = createRef<HTMLDivElement>();
    this.onInput = this.onInput.bind(this);
  }

  componentDidMount() {
    if (this.dom.current == null) {
      return;
    }
    this.renderTextToHtml(this.props.text);
    this.dom.current.addEventListener("keydown", (event) => this.onInput())
  }

  extractTextFromHtml(): string {
    if (this.dom.current == null) {
      return "";
    }
    let result = "";
    let queue = Array.from(this.dom.current.children);
    while (queue.length > 0) {
      const top = queue.shift()!;
      if (top.textContent != null) {
        result += top.textContent;
      }
      if (top.nodeType === Node.ELEMENT_NODE) {
        if (/^br$/i.test(top.tagName)) {
          result += "\r\n";
        }
        queue = Array.from(top.children).concat(queue);
      }
    }
    return result;
  }

  renderTextToHtml(text: string) {
    if (this.dom.current == null) {
      return;
    }

    const addSpan = (div: HTMLDivElement, content: string, tokenType: number) => {
      const span = document.createElement("span");
      span.setAttribute("class", "token-" + getTokenName(tokenType));
      span.textContent = content;
      div.appendChild(span);
    }

    const addLineBreak = (div: HTMLDivElement) => {
      const lineBreak = document.createElement("br");
      div.appendChild(lineBreak);
    }

    const inputStream = new ANTLRInputStream(text);
    const lexer = new BindingLanguageLexer(inputStream);
    this.dom.current.innerHTML = "";
    lexer.getAllTokens().forEach(tk => {
      const input = tk.text ?? "";
      switch (tk.type) {
        case BindingLanguageLexer.WS:
        case BindingLanguageLexer.TEXT:
          let match;
          let lastIndex = 0;
          while (lastIndex < input.length && (match = regexLineBreak.exec(input)) != null) {
            if (match.index > lastIndex) {
              addSpan(this.dom.current!, input.substring(lastIndex, match.index), tk.type);
            }
            addLineBreak(this.dom.current!);
            lastIndex = regexLineBreak.lastIndex;
          }
          if (input.length > lastIndex) {
            addSpan(this.dom.current!, input.substring(lastIndex), tk.type);
          }
          break;
        default:
          addSpan(this.dom.current!, input, tk.type);
      }
    });
  }

  extractSelection(): Cursor {
    const selection = window.getSelection()!;
    const cursor: Cursor = { end: 0, start: 0 };

    this.visit(this.dom.current!, node => {
      if (node === selection.anchorNode && node === selection.focusNode) {
        cursor.start += selection.anchorOffset
        cursor.end += selection.focusOffset
        cursor.direction = selection.anchorOffset <= selection.focusOffset ? Direction.Right : Direction.Left
        return "stop"
      }

      if (node === selection.anchorNode) {
        cursor.start += selection.anchorOffset
        if (!cursor.direction) {
          cursor.direction = Direction.Right
        } else {
          return "stop"
        }
      } else if (node === selection.focusNode) {
        cursor.end += selection.focusOffset
        if (!cursor.direction) {
          cursor.direction = Direction.Left
        } else {
          return "stop"
        }
      }

      if (node.nodeType === Node.TEXT_NODE) {
        if (cursor.direction !== Direction.Right) cursor.start += node.nodeValue!.length
        if (cursor.direction !== Direction.Left) cursor.end += node.nodeValue!.length
      }
    });

    return cursor;
  }

  applySelecton(pos: Cursor) {
    const s = window.getSelection()!
    let startNode: Node | undefined, startOffset = 0
    let endNode: Node | undefined, endOffset = 0

    if (pos.direction === undefined) pos.direction = Direction.Right
    if (pos.start < 0) pos.start = 0
    if (pos.end < 0) pos.end = 0

    // Flip start and end if the direction reversed
    if (pos.direction === Direction.Left) {
      const { start, end } = pos
      pos.start = end
      pos.end = start
    }

    let current = 0

    const editor = this.dom.current!;
    this.visit(editor, el => {
      if (el.nodeType !== Node.TEXT_NODE) return

      const len = (el.nodeValue || "").length
      if (current + len >= pos.start) {
        if (!startNode) {
          startNode = el
          startOffset = pos.start - current
        }
        if (current + len >= pos.end) {
          endNode = el
          endOffset = pos.end - current
          return "stop"
        }
      }
      current += len
    })

    // If everything deleted place cursor at editor
    if (!startNode) startNode = editor
    if (!endNode) endNode = editor

    // Flip back the selection
    if (pos.direction === Direction.Left) {
      [startNode, startOffset, endNode, endOffset] = [endNode, endOffset, startNode, startOffset]
    }

    s.setBaseAndExtent(startNode, startOffset, endNode, endOffset)

  }

  visit(editor: HTMLElement, visitor: (el: Node) => "stop" | undefined) {
    const queue: Node[] = []
    if (editor.firstChild) queue.push(editor.firstChild)

    let el = queue.pop()

    while (el) {
      if (visitor(el) === "stop")
        break

      if (el.nextSibling) queue.push(el.nextSibling)
      if (el.firstChild) queue.push(el.firstChild)

      el = queue.pop()
    }
  }

  onInput(): any {
    const selection = this.extractSelection();
    const text = this.extractTextFromHtml();
    this.renderTextToHtml(text);
    this.applySelecton(selection);
    this.props.textChanged?.call(null, text);
  }

  render() {
    return (
      <div ref={this.dom} className="editor" contentEditable spellCheck="false" />
    );
  }
}

export default Editor;
