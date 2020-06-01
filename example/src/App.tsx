import React from 'react';
import './App.css';
import { ChildContext } from './contexts/ChildContext'
import { MyExample } from './MyExample'
import { RootContext } from './contexts/RootContext'

function App() {
  return (
    <div className="App">
      <RootContext>
        <ChildContext>
          <MyExample />
        </ChildContext>
      </RootContext>
    </div>
  );
}

export default App;
