import React from 'react';
import logo from './logo.svg';
import './App.css';
import InfinitePaged from './InfinitePaged';
import ListItem from './ListItem';

const items = Array.apply(null, Array(1000)).map((item, i) => ({ content: i}));
console.log('items', items);

const App = () =>  (
  <div className="App">
    <div className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h2>Welcome to React</h2>
    </div>
    <div className="App-list">
      <InfinitePaged
        items={items}
        itemHeight={170}
        height={400}
        Component={ListItem}
        displayStart={100}
        displayEnd={150}
        trackElement={document.body}
      />
    </div>
  </div>
);

export default App;
