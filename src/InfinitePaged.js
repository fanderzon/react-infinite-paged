import React, { Component, PropTypes } from 'react';

import InfiniteList from './InfiniteList';
import {
  DEFAULT_ITEMS_PER_PAGE
} from './constants';

class InfinitePaged extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1
    };
  }

  componentDidMount() {
    const currentPage = this.props.startAtPage || 1;
    this.props.dispatch({
      type: 'FETCH_PAGE',
      payload: currentPage
    });
    this.setState({
      currentPage
    });
  }

  render() {
    if (!this.props.itemHeight) {
      console.error('itemHeight is a required prop');
      return null;
    }
    const sortedPages = sortPages(connectedPages(this.props.pages, this.props.startAtPage));
    const items = itemsFromPages(sortedPages);
    const firstPageId = sortedPages.length > 0 ? sortedPages[0].id : null;
    const lastPageId = sortedPages.length > 0 ? sortedPages[sortedPages.length - 1].id : null;
    const itemsPerPage = this.props.itemsPerPage || DEFAULT_ITEMS_PER_PAGE;

    return (
      <InfiniteList
        items={items}
        itemHeight={this.props.itemHeight}
        itemsStartOffset={firstPageId * itemsPerPage}
        onVisibleChange={params => {
          if (params.end >= (items.length - 1) && items.length > 0) {
            if (!sortedPages.find(i => i.id === (lastPageId + 1))) {
              this.props.dispatch({
                type: 'FETCH_PAGE',
                payload: (lastPageId + 1)
              });
            }
          }
        }}
        Component={this.props.Component}
        displayStart={100}
        displayEnd={150}
      />
    );
  }
};

function sortPages(pages) {
  return pages.concat().sort((a, b) => (a.id < b.id) ? -1 : 1);
}

function connectedPages(pages, startAtPage) {
  // We only want to create an pages list based on consecutive loaded pages
  // around the currentPage
  let arr = [];
  let currentIndex = pages.findIndex(i => i.id === startAtPage);
  if (currentIndex < 0) {
    return [];
  }

  for (let i = currentIndex; i < pages.length; i++) {
    let page = pages[i];
    // As long as we have loaded pages add their items to the array
    if (page.loaded) {
      arr = [ ...arr, page ];
    } else {
      break;
    }
  }
  for (let i = (currentIndex - 1); i > -1; i--) {
    let page = pages[i];
    // As long as we have loaded pages add their items to the array
    if (page.loaded) {
      arr = [ page, ...arr ];
    } else {
      break;
    }
  }

  return arr;
}

function itemsFromPages(pages) {
  return pages.reduce((acc, curr) => {
    return [ ...acc, ...curr.items ];
  }, []);
}

InfinitePaged.propTypes = {
  pages: PropTypes.array,
  startAtPage: PropTypes.number,
  itemsPerPage: PropTypes.number,
  itemHeight: PropTypes.number,
  Component: PropTypes.func
};

export default InfinitePaged;
