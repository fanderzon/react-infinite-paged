import React from 'react';
import InfinitePaged from '../InfinitePaged';

import logo from './logo.svg';
import './index.css';
import ListItem from './ListItem';
import sideEffects from './sideEffects';
import reducer from './reducer';
import StateContainer from './StateContainer';

let container;

const App = ({pages, items, dispatch}) => {
  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Welcome to React</h2>
      </div>
      <div className="App-list" ref={el => container = el}>
        <InfinitePaged
          height={container ? window.innerHeight - container.offsetTop : 300}
          pages={pages}
          startAtPage={2}
          itemHeight={170}
          itemsPerPage={10}
          Component={ListItem}
          dispatch={dispatch}
        />
      </div>
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Welcome to React</h2>
      </div>
    </div>
  );
}

export default StateContainer(reducer)(sideEffects)(App);
