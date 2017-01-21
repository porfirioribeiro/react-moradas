import React, {Component, PropTypes} from "react";
import cn from 'classnames';

class AutoComplete extends Component {
    handleInputKeyUp=(e)=>{
        console.log(e.keyCode);
    };

    handleInputChange=(e)=>{
        console.log(e.target.value);
    };
    render() {
        // eslint-disable-next-line no-unused-vars
        const {className, onChange, ...props} = this.props;
        return (
            <div className={cn('AutoComplete', className)}>
                <input className="AutoComplete_input" {...props} onKeyUp={this.handleInputKeyUp} onChange={this.handleInputChange}/>
                <div className="AutoComplete_results">
                    <ul className="AutoComplete_results_list">
                        <li className="AutoComplete_result">Result 1</li>
                        <li className="AutoComplete_result">Result 2</li>
                        <li className="AutoComplete_result">Result 3</li>
                        <li className="AutoComplete_result">Result 3</li>
                        <li className="AutoComplete_result">Result 4</li>
                    </ul>
                </div>
            </div>);
    }
}

AutoComplete.propTypes={
    value: PropTypes.string,
    onChange: PropTypes.func
};

export default AutoComplete;