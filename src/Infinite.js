import React, { Component, PropTypes } from 'react';

import { connectedPages, itemsFromPages, sortPages } from './util';
import { DEFAULT_ITEMS_PER_PAGE } from './constants';

class Infinite extends Component {
  constructor(props) {
    super(props);
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
    this.onVisibleChange = this.onVisibleChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchPage(this.props.startAtPage);
  }

  componentWillReceiveProps(newProps) {
    if (!this.state.loaded && newProps.pages.findIndex(i => i.id === newProps.startAtPage && i.loaded) !== -1) {
      this.setState({
        loaded: true
      },() => {
        this.container.scrollTop = newProps.loaderHeight;
      });
    }

    if (newProps.pages.length !== this.state.pages.length) {
      const pages = sortPages(connectedPages(newProps.pages, newProps.startAtPage));
      const firstPageId = pages.length > 0 ? pages[0].id : null;
      const newFirstPage = firstPageId < this.state.firstPageId && this.state.loaded;
      const items = itemsFromPages(pages);

      this.setState({
        pages,
        firstPageId,
        items,
      }, () => {
        this.calculatePosition(this.state.scroll, newProps);
        if (newFirstPage) {
          this.container.scrollTop = this.state.scroll + newProps.itemHeight * newProps.itemsPerPage;
        }
      });
    }
  }

  calculatePosition(scroll = 0, props) {
    // scroll can be NaN?
    scroll = scroll === scroll ? scroll : 0; // eslint-disable-line no-self-compare
    const itemsPerBody = Math.floor(this.props.height / this.props.itemHeight);
    const total = this.state.items.length;
    var visibleStart = Math.floor((scroll - (this.state.firstPageId !== 1 ? props.loaderHeight : 0)) / props.itemHeight);
    var visibleEnd = Math.min(visibleStart + (itemsPerBody - 1), total - 1);

    var renderStart = Math.max(0, (Math.floor(visibleStart / props.itemsPerPage) * props.itemsPerPage) - props.itemsPerPage);
    var renderEnd = Math.min(renderStart + (props.itemsPerPage * 3), total - 1);

    if ((visibleStart !== this.state.visibleStart) && this.state.loaded) {
      const scrollDirection = visibleStart > this.state.visibleStart ? 'down' : 'up';
      this.onVisibleChange({start: visibleStart, end: visibleEnd, scrollDirection});
    }

    this.setState({
      visibleStart,
      visibleEnd,
      renderStart,
      renderEnd,
      scroll: scroll,
    });
  }

  onScroll(event) {
    this.calculatePosition(this.container.scrollTop, this.props);
  }

  onVisibleChange(params) {
    const lastPageId = this.state.pages.length > 0 ? this.state.pages[this.state.pages.length - 1].id : null;
    if (params.start < 0) {
      this.props.fetchPage(this.state.firstPageId - 1);
    } else if (params.end >= (this.state.items.length - 1) && this.state.items.length > 0) {
      this.props.fetchPage(lastPageId + 1);
    }
  }

  render() {
    if (!this.props.itemHeight) {
      console.error('itemHeight is a required prop');
      return null;
    }
    if (!this.state.loaded) {
      return null;
    }

    const itemsPerPage = this.props.itemsPerPage || DEFAULT_ITEMS_PER_PAGE;

    const before = <div style={{height: this.state.renderStart * this.props.itemHeight}}></div>;
    const after = <div style={{height: ((this.state.items.length-1) - this.state.renderEnd) * this.props.itemHeight}}></div>;
    const visible = [];
    for (var i = this.state.renderStart; i <= this.state.renderEnd; ++i) {
      var item = this.state.items[i];
      visible.push(<this.props.Component key={i} {...item} />);
    }

    return (
      <div style={{top: 0, overflowX: 'hidden', overflowY: 'auto', height: this.props.height}} ref={el => this.container = el} onScroll={this.onScroll}>
      {
        this.state.firstPageId !== 1 && (
          <div style={{height: this.props.loaderHeight, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{<this.props.Loader />}</div>
        )
      }
        {before}
        {visible}
        {after}
        <div style={{height: this.props.loaderHeight, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{<this.props.Loader />}</div>
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
