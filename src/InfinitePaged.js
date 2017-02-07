import React, { Component, PropTypes } from 'react';

class InfinitePaged extends Component {
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
    console.log('this.props.displayStart * this.props.itemHeight', this.props.displayStart * this.props.itemHeight);
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

InfinitePaged.propTypes = {
  items: PropTypes.array,
  itemHeight: PropTypes.number,
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
