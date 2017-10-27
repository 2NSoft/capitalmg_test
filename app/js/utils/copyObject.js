const copyObject = (obj, target) => {
    const res = target || {};
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (obj[prop] instanceof Object) {
          if (Array.isArray(obj[prop])) {
            res[prop] = copyObject( obj[prop], [] );
          } else {
            res[prop] = copyObject(obj[prop]);
          }
        } else {
          res[prop] = obj[prop];
        }
      }
    }
    return res;
  };

module.exports = { copyObject };
