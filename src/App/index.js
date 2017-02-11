import React from 'react';
import InfiniteList from '../InfiniteList';
import InfinitePaged from '../InfinitePaged';

import logo from './logo.svg';
import './index.css';
import ListItem from './ListItem';
import api from './api';
import sideEffects from './sideEffects';
import reducer from './reducer';
import StateContainer from './StateContainer';

const App = ({pages, items, dispatch}) => {
  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Welcome to React</h2>
      </div>
      <div className="App-list">
        <InfinitePaged
          pages={pages}
          startAtPage={2}
          itemHeight={170}
          Component={ListItem}
          dispatch={dispatch}
        />
      </div>
    </div>
  );
}

export default StateContainer(reducer)(sideEffects)(App);
