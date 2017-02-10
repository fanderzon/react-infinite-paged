import React, { Component, PropTypes } from 'react';

import InfiniteList from './InfiniteList';

class InfinitePaged extends Component {
  // constructor(props) {
  //   super(props);
  // }

  componentDidMount() {
    this.props.dispatch({
      type: 'FETCH_PAGE',
      payload: 1
    });
  }

  render() {
    return (
      <InfiniteList
        items={this.props.pageItems}
        itemHeight={this.props.itemHeight}
        onVisibleChange={params => {
          console.log('onVisibleChange', params);
        }}
        Component={this.props.Component}
        displayStart={100}
        displayEnd={150}
      />
    );
  }
};

InfinitePaged.propTypes = {
  pages: PropTypes.array,
  pageItems: PropTypes.array,
  itemHeight: PropTypes.number,
  Component: PropTypes.func,
  currentPage: PropTypes.number,
};

export default InfinitePaged;
