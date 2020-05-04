import React, { FunctionComponent } from 'react';
import './Editor.css';

export interface EditorProps {
  text: string;
  textChanged: (newText: string) => void;
}

export const Editor: FunctionComponent<EditorProps> = ({
  text
}) => {
  return (
    <div className="Editor">
      {text}
    </div>
  );
}

export default Editor;
