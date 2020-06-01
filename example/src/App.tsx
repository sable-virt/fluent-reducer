import React from 'react';
import './App.css';
import { RootStateContext } from './reducers/RootReducer'
import { ChildStateContext } from './reducers/ChildReducer'
import { MyExample } from './MyExample'

function App() {
  return (
    <div className="App">
      <RootStateContext>
        <ChildStateContext>
          <MyExample />
        </ChildStateContext>
      </RootStateContext>
    </div>
  );
}

export default App;
