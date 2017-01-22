import React, { Component, PropTypes } from 'react';
import cn from 'classnames';
import invariant from 'invariant';
import ItemList from '../ItemList';

class AutoComplete extends Component {


  initialState = {
    options: [],
    showResults: false,
    focusedItem: -1,
  };

  state = { ...this.initialState };

  completeTimeout = 0;


  doLoadCompletions = (q) => {
    console.log('Logthis', q);
    if (this.props.loadCompletions) {
      const promise = this.props.loadCompletions(q);
      invariant(promise instanceof Promise, 'AutoComplete prop loadCompletions should return Promise');
      promise.then((options) => {
        this.setState({ options });
      });
    }
  };

  selectByIndex(i) {
    const item = this.state.options[i];
    const value = typeof item === 'string' ? item : item[this.props.index];
    if (this.props.onChange) this.props.onChange(value);
    if (this.props.onSelectItem) this.props.onSelectItem(item);
    this.setState({ ...this.initialState });
  }

  handleInputKeyDown = (e) => {
    console.log(e.keyCode, e.target.value);
    if (e.keyCode === 40)// Down
      this.setState({
        focusedItem: this.state.focusedItem === this.state.options.length - 1 ? 0 : this.state.focusedItem + 1,
      });
    if (e.keyCode === 38)// up
      this.setState({
        focusedItem: this.state.focusedItem < 1 ? this.state.options.length - 1 : this.state.focusedItem - 1,
      });
    if (e.keyCode === 27) {
      this.setState({ ...this.initialState });
    }
    if ((e.keyCode === 13 || e.keyCode === 9) && this.state.focusedItem > -1) {
      this.selectByIndex(this.state.focusedItem);
    }
        // Todo other keys
  };

  handleInputChange = (e) => {
    const value = e.target.value;
    if (this.props.onChange) this.props.onChange(value);
    clearTimeout(this.completeTimeout);
    this.completeTimeout = setTimeout(this.doLoadCompletions, 300, value);
  };

  handleInputFocus = () => this.setState({ showResults: true });
  handleInputBlur = () => {
    console.log('blut', this.preventBlur);
    if (!this.preventBlur)
      this.setState({ showResults: false });
            // setTimeout(this.setState.bind(this),1, {showResults: false});
  };

  handleItemClick = (i) => {
    this.selectByIndex(i);
    this.preventBlur = false;
  };

  handleItemPress = () => { this.preventBlur = true; };

  render() {
    // eslint-disable-next-line no-unused-vars
    const { className, onChange, onSelectItem, loadCompletions, index, ...props } = this.props;
        // console.log('render', this.state.focusedItem);
    return (
      <div className={cn('AutoComplete', className)}>
        <input
          className="AutoComplete_input" {...props}
          onKeyDown={this.handleInputKeyDown}
          onChange={this.handleInputChange}
          onFocus={this.handleInputFocus}
          onBlur={this.handleInputBlur}
        />
        {
                    this.state.showResults && (
                    <div className="AutoComplete_results">
                      <ItemList
                        dataSource={this.state.options} onItemClick={this.handleItemClick} onItemPress={this.handleItemPress}
                        index={index} focusedItem={this.state.focusedItem}
                      />
                    </div>)
                }
      </div>);
  }
}

AutoComplete.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  index: PropTypes.string,
  onChange: PropTypes.func,
  onSelectItem: PropTypes.func,
  loadCompletions: PropTypes.func,
};

AutoComplete.defaultProps = {
  index: 'text',
};

export default AutoComplete;
