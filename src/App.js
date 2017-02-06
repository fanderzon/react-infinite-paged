import React from 'react';
import logo from './logo.svg';
import './App.css';
import ListItem from './ListItem';

const items = Array.apply(null, Array(1000)).map((item, i) => i);
console.log('items', items);

const App = () =>  (
  <div className="App">
    <div className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h2>Welcome to React</h2>
    </div>
    <div className="App-list">
      {
        items.map(num => <ListItem>{num}</ListItem>)
      }
    </div>
  </div>
);

export default App;
