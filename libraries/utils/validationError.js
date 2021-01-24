let result = [];

function generate(key, message) {
  return { key, message };
}

module.exports.convert = (err) => {
  result = [];

  if (Object.prototype.hasOwnProperty.call(err, 'details')) {
    if (err.details.body) {
      err.details.body.forEach((element) => {
        result.push(generate(element.path[0], element.message));
      });
    }
    if (err.details.query) {
      err.details.query.forEach((element) => {
        result.push(generate(element.path[0], element.message));
      });
    }
  }

  if (Object.prototype.hasOwnProperty.call(err, 'errors')) {
    Object.keys(err.errors).forEach((key) => {
      result.push(generate(key, err.errors[key].message));
    });
  }
  return result;
};
