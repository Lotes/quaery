import React, { createRef } from 'react';
import './Editor.css';
import { CodeJar } from "./codejar";
import { highlight } from './syntaxHighlight';

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
    this.dom.current.innerHTML = "";
    highlight(this.dom.current, text);
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
