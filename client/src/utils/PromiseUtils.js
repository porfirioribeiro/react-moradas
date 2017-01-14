export const keys= (val) => {
    const keys = Object.keys(val);
    const promises = keys.map( (key) => val[key] );
    return Promise.all(promises)
        .then((results) =>
            keys.reduce( (obj, key, i) => {
                obj[key] = results[i];
                return obj;
            }, {})
        );
};

export default {keys}