import React from 'react';

const StateContainer = reducer => sideEffects => Component =>
  class StateContainer extends React.Component {
    constructor(props) {
      super(props);
      this.state = reducer();
      this.reducer = reducer.bind(null, this.state);
      this.dispatch = this.dispatch.bind(this);
    }

    dispatch(action) {
      sideEffects(this.state, this.dispatch, action);
      const newState = this.reducer(action);
      this.setState(newState);
    }

    render() {
      return <Component {...this.state} dispatch={this.dispatch} />
    }
  };

export default StateContainer;
