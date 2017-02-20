import React, { Component, PropTypes } from 'react';

import { connectedPages, itemsFromPages, sortPages } from './util';
import { DEFAULT_ITEMS_PER_PAGE } from './constants';

class Infinite extends Component {
  constructor(props) {
    super(props);
    console.log(props.height, props.itemHeight, props.height / props.itemHeight);
    this.state = {
      pages: [],
      items: [],
      firstPageId: props.startAtPage || 1,
      loaded: false,
      visibleStart: 0,
      visibleEnd: 0,
      renderStart: 0,
      renderEnd: 0,
      scroll: 0,
    };
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'FETCH_PAGE',
      payload: this.props.startAtPage
    });
  }

  componentWillReceiveProps(newProps) {
    if (!this.state.loaded && newProps.pages.findIndex(i => i.id === newProps.startAtPage && i.loaded) !== -1) {
      this.setState({
        loaded: true
      });
    }
    if (newProps.pages.length !== this.state.pages.length) {
      const pages = sortPages(connectedPages(newProps.pages, newProps.startAtPage));
      const firstPageId = pages.length > 0 ? pages[0].id : null;
      const items = itemsFromPages(pages);
      this.setState({
        pages,
        firstPageId,
        items,
      }, () => {
        this.calculatePosition(this.state.scroll, newProps);
      });
    }
  }

  calculatePosition(scroll = 0, props) {
    // scroll can be NaN?
    scroll = scroll === scroll ? scroll : 0; // eslint-disable-line no-self-compare
    const itemsPerBody = Math.floor(this.props.height / this.props.itemHeight);
    const total = this.state.items.length;
    var visibleStart = Math.floor(scroll / props.itemHeight);
    var visibleEnd = Math.min(visibleStart + (itemsPerBody - 1), total - 1);

    var renderStart = Math.max(0, (Math.floor(visibleStart / props.itemsPerPage) * props.itemsPerPage) - props.itemsPerPage);
    var renderEnd = Math.min(renderStart + (props.itemsPerPage * 3), total - 1);

    console.log(`render ${renderStart}-${renderEnd} visible ${visibleStart}-${visibleEnd}`);

    if (this.props.onVisibleChange && (visibleStart !== this.state.visibleStart)) {
      const scrollDirection = visibleStart > this.state.visibleStart ? 'down' : 'up';
      this.props.onVisibleChange({start: visibleStart, end: visibleEnd, scrollDirection});
    } else if (this.props.onVisibleChange && (visibleStart !== this.state.visibleStart) && visibleStart < 0) {
      // TODO: If we want a scroll up gesture, add logic here
      console.log('possible visibility change', visibleStart);
    }


    this.setState({
      visibleStart: visibleStart,
      visibleEnd: visibleEnd,
      renderStart,
      renderEnd,
      scroll: scroll,
    });
  }

  onScroll(event) {
    this.calculatePosition(this.container.scrollTop, this.props);
  }

  render() {
    window.props = this.props;
    if (!this.props.itemHeight) {
      console.error('itemHeight is a required prop');
      return null;
    }
    if (!this.state.loaded) {
      return null;
    }

    const sortedPages = sortPages(connectedPages(this.props.pages, this.props.startAtPage));
    const firstPageId = sortedPages.length > 0 ? sortedPages[0].id : null;
    const lastPageId = sortedPages.length > 0 ? sortedPages[sortedPages.length - 1].id : null;
    const itemsPerPage = this.props.itemsPerPage || DEFAULT_ITEMS_PER_PAGE;
    const initialFocus = (firstPageId - 1) * itemsPerPage;

    // If first page is not 1, let's add one page worth of "padding" items before the first real item
    const items = firstPageId === 1 ? itemsFromPages(sortedPages) : [
      ...Array.apply(null, Array(itemsPerPage)).map((item, i) => ({ id: i - itemsPerPage, content: '😎'})),
      ...itemsFromPages(sortedPages)
    ];

    const before = <div style={{height: this.state.renderStart * this.props.itemHeight}}></div>;
    const after = <div style={{height: (this.state.items.length - this.state.renderEnd) * this.props.itemHeight}}></div>;
    const visible = [];
    for (var i = this.state.renderStart; i <= this.state.renderEnd; ++i) {
      var item = this.state.items[i];
      visible.push(<this.props.Component key={i} {...item} />);
    }

    return (
      <div style={{top: 0, overflowX: 'hidden', overflowY: 'auto', background: 'blue', height: this.props.height}} ref={el => this.container = el} onScroll={this.onScroll}>
        {before}
        {visible}
        {after}
      </div>
    );
  }
}

Infinite.propTypes = {
  pages: PropTypes.array,
  startAtPage: PropTypes.number,
  itemsPerPage: PropTypes.number,
  itemHeight: PropTypes.number,
  Component: PropTypes.func
};

export default Infinite;
