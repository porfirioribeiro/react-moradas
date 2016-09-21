import React, {PropTypes} from 'react';
import classnames from 'classnames'

import Select from 'react-select'
import 'react-select/dist/react-select.css'

const LabeledSelect = ({label,component,className,labelClassName,selectClassName, ...selectProps}) => (
    <div className={classnames("LabeledSelect",className)}>
        <div className={classnames("LabeledSelect--label",labelClassName)}>{label}</div>
        { React.createElement(component, {...selectProps,className:classnames("LabeledSelect--select",selectClassName)})}
    </div>
);
LabeledSelect.propTypes = {
    component: PropTypes.func,
    label: PropTypes.string
};
LabeledSelect.defaultProps = {
    component: Select
};

export default LabeledSelect;