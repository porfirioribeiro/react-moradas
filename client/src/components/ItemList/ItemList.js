import React, {Component, PropTypes} from 'react';
import cn from 'classnames';

const defaultItemRenderer=(text, item) => text;

class List extends Component{
    renderItem=(item, index)=>{
        return <div key={index} className="List_item">{this.props.itemRenderer(item)}</div>
    }
    render(){
        const {dataSource, className, style}=this.props;
        return (
            <div className={cn('List', className)} style={style}>
                {
                    dataSource && dataSource.map(this.renderItem)
                }
            </div>
        )
    }
}

List.propTypes={
    className: PropTypes.string,
    style: PropTypes.object,
    dataSource: PropTypes.array,
    itemRenderer: PropTypes.func,
    // itemHeight: React.PropTypes.oneOfType([
    //     React.PropTypes.string,
    //     React.PropTypes.number,
    // ])
};

List.defaultProps={
    itemRenderer: defaultItemRenderer
};

export default List;