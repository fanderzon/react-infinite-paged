import React from 'react';
import Infinite from '../Infinite';

import logo from './logo.svg';
import './index.css';
import ListItem from './ListItem';
import sideEffects from './sideEffects';
import reducer from './reducer';
import StateContainer from './StateContainer';

let container;

const Loader = () => (
  <div className="loader"></div>
);

const App = ({pages, items, dispatch}) => {
  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Welcome to React</h2>
      </div>
      <div className="App-list" ref={el => container = el}>
        <Infinite
          height={container ? window.innerHeight - container.offsetTop : 300}
          pages={pages}
          startAtPage={5}
          itemHeight={180}
          itemsPerPage={10}
          Component={ListItem}
          Loader={Loader}
          loaderHeight={150}
          fetchPage={payload => dispatch({
            type: 'FETCH_PAGE',
            payload
          })}
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
