import React, { Component, PropTypes } from 'react';

class InfiniteContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldUpdate: true,
      total: 0,
      displayStart: 0,
      displayEnd: 0
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
    return this.state.shouldUpdate;
  }

  render() {
    const before = <div style={{height: this.props.displayStart * this.props.itemHeight}}></div>;
    const after = <div style={{height: (this.props.items.length - this.props.displayEnd) * this.props.itemHeight}}></div>;
    const visible = [];
    for (var i = this.props.displayStart; i < this.props.displayEnd; ++i) {
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

class InfinitePaged extends Component {
  constructor(props) {
    super(props);

    this.state = this.defaultState(props);
    this.scrollState = this.scrollState.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    // Bind to the scroll event on mount
    const el = this.props.trackElement || document;
    document.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.onScroll);
  }

  defaultState(props) {
    const itemsPerBody = Math.floor((props.height - 2) / props.itemHeight);

    return {
      total: props.items.length,
      items: props.items,
      itemHeight: props.itemHeight,
      itemsPerBody,
      visibleStart: 0,
      visibleEnd: itemsPerBody,
      displayStart: 0,
      displayEnd: itemsPerBody * 2
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.defaultState(nextProps));
    this.scrollState(this.state.scroll);
  }

  scrollState(scroll) {
    var visibleStart = Math.floor(scroll / this.state.itemHeight);
    var visibleEnd = Math.min(visibleStart + this.state.itemsPerBody, this.state.total - 1);

    var displayStart = Math.max(0, Math.floor(scroll / this.state.itemHeight) - this.state.itemsPerBody * 1.5);
    var displayEnd = Math.min(displayStart + 4 * this.state.itemsPerBody, this.state.total - 1);

    this.setState({
        visibleStart: visibleStart,
        visibleEnd: visibleEnd,
        displayStart: displayStart,
        displayEnd: displayEnd,
        scroll: scroll
    });
  }

  onScroll(event) {
    this.scrollState(this.props.trackElement.scrollTop);
  }

  formatNumber(number) {
    return (''+number).split('').reverse().join('').replace(/(...)/g, '$1,').split('').reverse().join('').replace(/^,/, '');
  }

  getCount() {
    return (1 + this.formatNumber(this.state.visibleStart)) +
      '-' + (1 + this.formatNumber(this.state.visibleEnd)) +
      ' of ' + this.formatNumber(this.state.total);
  }

  render() {
    return (
      <div style={{top: 26, overflowX: 'hidden', overflowY: 'auto', background: 'blue'}} ref={el => this.scrollable = el} onScroll={this.onScroll}>
        <InfiniteContent
          items={this.state.items}
          total={this.state.items.length}
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
  height: PropTypes.number,
  visibleStart: PropTypes.number,
  visibleEnd: PropTypes.number,
  displayStart: PropTypes.number,
  displayEnd: PropTypes.number
};

const Infinite = ({items = [], Component, visibleStart, visibleEnd}) => {
  return (
    <div>
    {
      items.map((item, i) => <Component key={i} {...item} />)
    }
    </div>
  );
};

export default InfinitePaged;
