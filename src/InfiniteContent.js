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

export default InfiniteContent;
