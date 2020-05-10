import React, { useState } from 'react';
import './App.css';
import Editor from './ui/Editor';

function App() {
  const [text, setText] = useState<string>("Hello, {{User.Name}}!");
  return (
    <div className="App">
      <h1>Editor</h1>
      <p>
        <Editor text={text} textChanged={setText} />
      </p>
      <h2>Error list</h2>
      <p>

      </p>
      <h1>Plain text</h1>
      <p>
        {text.split("\n").map(x => (<>
          {x}<br />
        </>))}
      </p>
    </div>
  );
}

export default App;
