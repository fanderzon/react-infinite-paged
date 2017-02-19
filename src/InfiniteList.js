import React, { Component, PropTypes } from 'react';

import InfiniteContent from './InfiniteContent';

class InfiniteList extends Component {
  constructor(props) {
    super(props);
    this.state = this.defaultState(props);
    this.scrollState = this.scrollState.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    this.setState(this.defaultState(this.props));
    // Bind to the scroll event on mount
    const el = this.props.trackElement || document;
    el.addEventListener('scroll', this.onScroll);
    this.container.scrollTop = this.state.displayStart * this.props.itemHeight;
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.onScroll);
  }

  defaultState(props) {
    const height = window.innerHeight;
    const itemsPerBody = Math.floor((height - 2) / props.itemHeight);
    return {
      itemHeight: props.itemHeight,
      height,
      itemsPerBody,
      visibleStart: 0,
      visibleEnd: itemsPerBody - 1,
      displayStart: props.displayStart || 0,
      displayEnd: props.displayEnd || itemsPerBody * 2,
      scrolled: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.scrollState(this.state.scroll, nextProps);
  }

  scrollState(scroll = 0, props) {
    // scroll can be NaN?
    scroll = scroll === scroll ? scroll : 0; // eslint-disable-line no-self-compare
    const listOffset = (props.itemsStartOffset || 0) * props.itemHeight;
    let itemsPerBody = this.state.itemsPerBody;

    const total = props.items.length;
    var visibleStart = Math.floor((scroll - listOffset) / props.itemHeight);
    var visibleEnd = Math.min(visibleStart + (itemsPerBody - 1), total - 1);

    var displayStart = Math.max(0, Math.floor(((scroll - listOffset) / props.itemHeight) - itemsPerBody * 1.5));
    var displayEnd = Math.min(displayStart + 4 * itemsPerBody, total - 1);

    if (this.props.onVisibleChange && (visibleStart !== this.state.visibleStart)) {
      const scrollDirection = visibleStart > this.state.visibleStart ? 'down' : 'up';
      this.props.onVisibleChange({start: visibleStart, end: visibleEnd, scrollDirection});
    } else if (this.props.onVisibleChange && (visibleStart !== this.state.visibleStart) && visibleStart < 0) {
      // TODO: If we want a scroll up gesture, add logic here
      console.log('possible visibility change', visibleStart);
    }

    const scrolled = this.state.scrolled || (scroll > 0);
    this.setState({
        visibleStart: visibleStart,
        visibleEnd: visibleEnd,
        displayStart: displayStart,
        displayEnd: displayEnd,
        scroll: scroll,
        scrolled
    });
  }

  onScroll(event) {
    this.scrollState(this.container.scrollTop, this.props);
  }

  formatNumber(number) {
    return (''+number).split('').reverse().join('').replace(/(...)/g, '$1,').split('').reverse().join('').replace(/^,/, '');
  }

  getCount() {
    return (1 + this.formatNumber(this.state.visibleStart)) +
      '-' + (1 + this.formatNumber(this.state.visibleEnd)) +
      ' of ' + this.formatNumber(this.props.items.length);
  }

  render() {
    const itemsStartOffset = this.props.itemsStartOffset || 0;
    return (
      <div style={{top: 26, overflowX: 'hidden', overflowY: 'auto', background: 'blue', height: this.props.height}} ref={el => this.container = el} onScroll={this.onScroll}>
        <div style={{width: '100%', background: 'purple', height: (itemsStartOffset * this.state.itemHeight) }}></div>
        <InfiniteContent
          items={this.props.items}
          total={this.props.items.length || 0}
          visibleStart={this.state.visibleStart}
          visibleEnd={this.state.visibleEnd}
          displayStart={this.state.displayStart}
          displayEnd={this.state.displayEnd}
          itemHeight={this.state.itemHeight}
          Component={this.props.Component}
          trackElement={this.container}
        />
      </div>
    );
  }
}

InfiniteContent.propTypes = {
  items: PropTypes.array,
  itemHeight: PropTypes.number,
  itemsStartOffset: PropTypes.number,
  height: PropTypes.number,
  visibleStart: PropTypes.number,
  visibleEnd: PropTypes.number,
  displayStart: PropTypes.number,
  displayEnd: PropTypes.number,
  renderBefore: PropTypes.node,
  renderAfter: PropTypes.node
};

export default InfiniteList;
