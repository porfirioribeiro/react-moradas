import React from 'react';
import {Link} from 'react-router';
import asyncConnect from '../utils/asyncConnect';

import {loadDistricts} from '../redux/adress';

export const Distritos=({
    districts,
    isLoading,
    pathname,
    ...props
})=>{
    if (isLoading) return <div>Loading...</div>;
    return (<div>
        <div>Distritos:</div>
        {
            districts.map((district,key)=>{
                return (<span key={key}>
                    <Link to={`${pathname}/${district}`}>{district}</Link> -
                </span>);
            })
        }
    </div>);
};

export default asyncConnect({
    districts: ({dispatch})=>dispatch(loadDistricts())
})(Distritos);