export default {
  keys: (val) => {
    const keys = Object.keys(val);
    return Promise.all(keys.map(key => val[key]))
      .then(results =>
        keys.reduce((obj, key, i) => ({
          ...obj, [key]: results[i],
        }), {}),
      );
  },
};
