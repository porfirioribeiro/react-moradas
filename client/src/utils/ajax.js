export const origin = process.env.NODE_ENV !== 'production' ? 'http://0.0.0.0:8080' : location.origin;


export const fetchJSON = url => fetch(`${origin}/${url}`).then(r => r.json());

export default { fetchJSON };
