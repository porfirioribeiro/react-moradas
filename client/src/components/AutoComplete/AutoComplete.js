import React, { PureComponent, PropTypes } from 'react';
import cn from 'classnames';
import invariant from 'invariant';
import _ from 'lodash';
import ItemList from '../ItemList';

class AutoComplete extends PureComponent {


  initialState = {
    options: [],
    showResults: false,
    focusedItem: -1,
  };

  state = {
    options: [],
    showResults: false,
    focusedItem: -1,
  };

  completeTimeout = 0;
  inputHasFocus = false;

  componentWillMount() {
    invariant(!((!this.props.options && !this.props.loadOptions) ||
      (this.props.options && this.props.loadOptions)),
      'AutoComplete#props: You either have to specify options or loadOptions, and only one of them! controlled/uncontrolled');
  }

  componentWillReceiveProps({ options }) {
    if (!_.isEqual(options, this.props.options)) {
      this.setState({ showResults: this.inputHasFocus });
      this.shouldUpdateOptions = true;
    }
  }

  shouldComponentUpdate({ value }, nextState) {
    return (!_.isEqual(value, this.props.value) ||
      !_.isEqual(nextState, this.state) || this.shouldUpdateOptions || false);
  }

  queryInput = (q) => {
    if (this.props.onQueryInput) this.props.onQueryInput(q);
    if (this.props.loadOptions) {
      const promise = this.props.loadOptions(q);
      invariant(promise instanceof Promise, 'AutoComplete prop loadCompletions should return Promise');
      promise.then((options) => {
        this.setState({ options, showResults: this.inputHasFocus, focusedItem: -1 });
      });
    }
  };

  selectByIndex(i) {
    const options = this.props.options || this.state.options;
    const item = options[i];
    const value = typeof item === 'string' ? item : item[this.props.index];
    if (this.props.onChange) this.props.onChange(value);
    if (this.props.onSelectItem) this.props.onSelectItem(item);
    this.setState({ ...this.initialState });
  }

  handleInputKeyDown = (e) => {
    const options = this.props.options || this.state.options;
    if (e.keyCode === 40)// Down
      this.setState({
        focusedItem: this.state.focusedItem === options.length - 1 ? 0 : this.state.focusedItem + 1,
      });
    if (e.keyCode === 38)// up
      this.setState({
        focusedItem: this.state.focusedItem < 1 ? options.length - 1 : this.state.focusedItem - 1,
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
    this.completeTimeout = setTimeout(this.queryInput, 300, value);
  };

  handleInputFocus = () => {
    this.inputHasFocus = true;
  };
  handleInputBlur = () => {
    if (!this.preventBlur) {
      this.inputHasFocus = false;
      this.setState({ showResults: false });
    }
  };

  handleItemClick = (i) => {
    this.preventBlur = false;
    this.selectByIndex(i);
  };

  handleItemPress = () => {
    this.preventBlur = true;
  };

  render() {
    /* eslint-disable no-unused-vars*/
    const {
      className, onChange, onSelectItem, loadOptions,
      optionRenderer, onQueryInput, options, index, ...props
    } = this.props;
    const dataSource = options || this.state.options;
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
          this.state.showResults && (dataSource.length > 0) && (
            <div className="AutoComplete_results">
              <ItemList
                className="AutoComplete_results_list"
                dataSource={dataSource}
                onItemClick={this.handleItemClick} onItemPress={this.handleItemPress}
                index={index} focusedItem={this.state.focusedItem} itemRenderer={optionRenderer}
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
  optionRenderer: PropTypes.func,
  // uncontrolled mode, AutoComplete handles options inside,
  // you just need to add a load completions function
  loadOptions: PropTypes.func,
  // controlled mode
  options: PropTypes.array,
  onQueryInput: PropTypes.func,
};

AutoComplete.defaultProps = {
  index: 'text',
};

export default AutoComplete;
