import React, { PropTypes } from 'react';


const ListItem = ({ className = 'ListItem', style, rowData, rowIndex, icon, children, actions, ...props }) => (
  <div
    className={className}
    style={style}
    {...props}
  >{children}</div>
);

ListItem.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
  rowData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  icon: PropTypes.string,
  actions: PropTypes.arrayOf(PropTypes.object),
};

export default ListItem;
