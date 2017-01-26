import React, { Component, PropTypes } from 'react';
import cn from 'classnames';

import List from './List';
import ListItem from './ListItem';

/* eslint-disable react/jsx-no-bind */
class ItemList extends Component {

  renderRow=(rowData, rowIndex) => {
    return (<ListItem
      key={rowIndex}
      rowData={rowData} rowIndex={rowIndex}
      onClick={this.props.onItemClick && this.props.onItemClick.bind(null, rowIndex, rowData)}
      onMouseDown={this.props.onItemPress && this.props.onItemPress.bind(null, rowIndex, rowData)}
      className={cn(this.props.itemClassName, { [`${this.props.itemClassName}--focused`]: this.props.focusedIndex === rowIndex })}
      {...this.props.itemProps}
    >{this.props.itemRenderer(rowData, rowIndex, this.props.index)}</ListItem>);
  };

  render() {
    const { className, ...props } = this.props;
    return (<List
      className={cn('ItemList', className)}
      rowRenderer={this.renderRow}
      {...props}
    />);
  }
}

const itemRenderer = (item, i, key) => (typeof item === 'string' ? item : item[key]);

ItemList.propTypes = {
  className: PropTypes.string,
  itemClassName: PropTypes.string,
  style: PropTypes.object,
  dataSource: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  index: PropTypes.string,
  itemRenderer: PropTypes.func,
  itemProps: PropTypes.object,
  onItemClick: PropTypes.func,
  onItemPress: PropTypes.func,
  focusedIndex: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};

ItemList.defaultProps = {
  itemClassName: 'ListItem',
  index: 'text',
  itemRenderer,
};


export default ItemList;
