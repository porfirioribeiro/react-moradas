import React from 'react';
import {Link} from 'react-router';
import asyncConnect from '../utils/asyncConnect';

import {loadDistricts, loadCountys} from '../redux/adress';

export const Countys=({
    districts,
    countys,
    isLoading,
    pathname,
    params,
    ...props
})=>{
    console.log(props);
    if (isLoading) return <div>Loading...</div>;
    return (<div>
        <div>Distritos:</div>
        {
            districts.map((district,key)=>{
                return (<span key={key}>
                    <Link to={`/districts/${district}`}>{district}</Link> -
                </span>);
            })
        }
        <div>Concelhos do distrito de {params.district}</div>
        {
            countys.map((county,key)=>{
                return (<span key={key}>
                    <Link to={`/districts/${params.district}/${county}`}>{county}</Link> -
                </span>);
            })
        }
    </div>);
};

export default asyncConnect({
    districts: ({dispatch, state})=>state.districts || dispatch(loadDistricts()),
    countys: ({dispatch, props})=>dispatch(loadCountys(props.params.district)),
})(Countys);