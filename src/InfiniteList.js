import React, { Component, PropTypes } from 'react';

class InfiniteContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldUpdate: true,
      total: 0,
      displayStart: 0,
      displayEnd: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    var shouldUpdate = !(
      nextProps.visibleStart >= this.state.displayStart &&
      nextProps.visibleEnd <= this.state.displayEnd
    ) || (nextProps.total !== this.state.total);

    if (shouldUpdate) {
      this.setState({
        shouldUpdate: shouldUpdate,
        total: nextProps.total,
        displayStart: nextProps.displayStart,
        displayEnd: nextProps.displayEnd
      });
    } else {
      this.setState({shouldUpdate: false});
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.shouldUpdate;
  }

  render() {
    const displayStart = this.props.displayStart || 0;
    const displayEnd = this.props.displayEnd || 10;
    const before = <div style={{height: displayStart * this.props.itemHeight}}></div>;
    const after = <div style={{height: (this.props.items.length - displayEnd) * this.props.itemHeight}}></div>;
    const visible = [];
    for (var i = displayStart; i <= displayEnd; ++i) {
      var item = this.props.items[i];
      visible.push(<this.props.Component key={i} {...item} />);
    }

    return (
      <div>
        {before}
        {visible}
        {after}
      </div>
    );
  }
}

InfiniteContent.propTypes = {
  items: PropTypes.array,
  itemHeight: PropTypes.number,
  visibleStart: PropTypes.number,
  visibleEnd: PropTypes.number,
  displayStart: PropTypes.number,
  displayEnd: PropTypes.number
};

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
      displayStart: 0,
      displayEnd: itemsPerBody * 2
    };
  }

  componentWillReceiveProps(nextProps) {
    this.scrollState(this.state.scroll, nextProps);
  }

  scrollState(scroll = 0, props) {
    // scroll can be NaN?
    scroll = scroll === scroll ? scroll : 0; // eslint-disable-line no-self-compare
    const listOffset = (props.itemsStartOffset || 0) * props.itemHeight;
    const pageOffset = this.container.offsetTop;
    let itemsPerBody = this.state.itemsPerBody;
    if (scroll < pageOffset) {
      scroll = 0;
      itemsPerBody -= Math.floor(pageOffset / props.itemHeight);
    } else {
      scroll -= pageOffset;
    }

    const total = props.items.length;
    var visibleStart = Math.floor((scroll - listOffset) / props.itemHeight);
    var visibleEnd = Math.min(visibleStart + (itemsPerBody - 1), total - 1);

    var displayStart = Math.max(0, Math.floor((scroll - listOffset) / props.itemHeight) - itemsPerBody * 1.5);
    var displayEnd = Math.min(displayStart + 4 * itemsPerBody, total - 1);

    if (this.props.onVisibleChange && (visibleStart !== this.state.visibleStart) && visibleStart > -1) {
      const scrollDirection = visibleStart > this.state.visibleStart ? 'down' : 'up';
      this.props.onVisibleChange({start: visibleStart, end: visibleEnd, scrollDirection});
    }

    this.setState({
        visibleStart: visibleStart,
        visibleEnd: visibleEnd,
        displayStart: displayStart,
        displayEnd: displayEnd,
        scroll: scroll
    });
  }

  onScroll(event) {
    const trackElement = this.props.trackElement || document.body;
    this.scrollState(trackElement.scrollTop, this.props);
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
