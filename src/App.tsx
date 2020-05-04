import React, { useState } from 'react';
import './App.css';
import Editor from './ui/Editor';

function App() {
  const [text, setText] = useState<string>("Hallo!");
  return (
    <div className="App">
      <h1>Binding editor</h1>
      <p>
        <Editor text={text} textChanged={setText} />
      </p>
    </div>
  );
}

export default App;
