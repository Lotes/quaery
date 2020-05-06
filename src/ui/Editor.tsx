import React, { createRef } from 'react';
import './Editor.css';
import { BindingLanguageLexer } from '../parser/generated/BindingLanguageLexer';
import { ANTLRInputStream } from 'antlr4ts';
import { getTokenName } from '../parser/Tokens';
import { CodeJar } from "codejar";

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

class Editor extends React.Component<EditorProps> {
  private dom: React.RefObject<HTMLDivElement>;
  constructor(props: EditorProps) {
    super(props);
    this.dom = createRef<HTMLDivElement>();
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

    const inputStream = new ANTLRInputStream(text);
    const lexer = new BindingLanguageLexer(inputStream);
    this.dom.current.innerHTML = "";
    lexer.getAllTokens().forEach(tk => {
      const input = tk.text ?? "";
      addSpan(this.dom.current!, input, tk.type);
    });
  }
  componentDidMount() {
    const jar = CodeJar(this.dom.current!, (editor) => {
      this.renderTextToHtml(editor.textContent!);
    }, {
      tab: "  "
    });
    jar.updateCode(this.props.text);
    jar.onUpdate(this.props.textChanged);
  }
  render() {
    return (
      <div ref={this.dom} className="editor" />
    );
  }
}

export default Editor;
