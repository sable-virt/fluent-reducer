import React from 'react';
import './App.css';
import { MyExample } from './MyExample'
import { RootContext } from './contexts/RootContext'

function App() {
  return (
    <div className="App">
      <RootContext>
        <MyExample />
      </RootContext>
    </div>
  );
}

export default App;
