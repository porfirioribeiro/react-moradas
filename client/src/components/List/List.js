import React, { Component, PropTypes } from 'react';
import cn from 'classnames';
import map from 'lodash/map';

class List extends Component {

  renderRow=(rowData, rowIndex) => {
    if (this.props.component)
      return React.createElement(this.props.component, { key: rowIndex, props: this.props.componentProps, rowData, rowIndex });
    return (this.props.rowRenderer)(rowData, rowIndex, this.props.componentProps);
  };

  render() {
    const { dataSource, className, style, children } = this.props;
    return (
      <div className={cn('List', className)} style={style}>
        {children}
        {
          dataSource && map(dataSource, this.renderRow)
        }
      </div>
    );
  }
}


List.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
  dataSource: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  rowRenderer: PropTypes.func,
  component: PropTypes.func,
  componentProps: PropTypes.object,
};

export default List;
