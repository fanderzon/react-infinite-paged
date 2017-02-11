import React from 'react';

const StateContainer = reducer => sideEffects => Component =>
  class StateContainer extends React.Component {
    constructor(props) {
      super(props);
      this.state = reducer();
      this.dispatch = this.dispatch.bind(this);
    }

    dispatch(action) {
      sideEffects(this.state, this.dispatch, action);
      this.setState(reducer(this.state, action));
    }

    render() {
      return <Component {...this.state} dispatch={this.dispatch} />
    }
  };

export default StateContainer;
