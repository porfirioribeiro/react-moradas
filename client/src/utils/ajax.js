export const origin=process.env.NODE_ENV!=="production"?"http://0.0.0.0:8080":location.origin;


export const GET= (url)=>fetch(origin+"/"+url).then(r=>r.json());

export const dispatchAndPromise=(dispatch, type, payload)=>{
    dispatch({type,payload});
    return Promise.resolve(payload);
};