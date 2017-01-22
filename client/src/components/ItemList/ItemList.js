import React, { Component, PropTypes } from 'react';
import cn from 'classnames';

const defaultItemRenderer = (item, key) =>
    (typeof item === 'string' ? item : item[key]);

class ItemList extends Component {

  renderItem=(item, i) => (
    <div
      key={i}
      onClick={this.props.onItemClick && this.props.onItemClick.bind(this, i)}
      onMouseDown={this.props.onItemPress && this.props.onItemPress.bind(this, i)}
      className={cn('ItemList_item', { 'ItemList_item--focused': this.props.focusedItem === i })}
    >
      {this.props.itemRenderer(item, this.props.index)}
    </div>
    );

  render() {
    const { dataSource, className, style } = this.props;

    return (
      <div className={cn('ItemList', className)} style={style}>
        {
                    dataSource && dataSource.map(this.renderItem)
                }
      </div>
    );
  }
}

ItemList.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  dataSource: PropTypes.array,
  itemRenderer: PropTypes.func,
  onItemClick: PropTypes.func,
  onItemPress: PropTypes.func,
  index: PropTypes.string,
  focusedItem: PropTypes.number,
    // itemHeight: React.PropTypes.oneOfType([
    //     React.PropTypes.string,
    //     React.PropTypes.number,
    // ])
};

ItemList.defaultProps = {
  itemRenderer: defaultItemRenderer,
  index: 'text',
};

export default ItemList;
