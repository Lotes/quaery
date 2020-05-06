import React, { useState } from 'react';
import './App.css';
import Editor from './ui/Editor';

function App() {
  const [text, setText] = useState<string>("Hello, {{User.Name}}!");
  return (
    <div className="App">
      <h1>Binding editor</h1>
      <p>
        <Editor text={text} textChanged={setText} />
        {text}
      </p>
    </div>
  );
}

export default App;
