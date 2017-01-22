import React, { PropTypes } from 'react';
import cn from 'classnames';

const Card = ({ className, children }) => (
  <div className={cn('Card', className)}>
    {children}
  </div>
);


Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Card;
