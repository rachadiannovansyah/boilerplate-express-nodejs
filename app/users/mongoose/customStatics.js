const moment = require('moment');

async function customStore(context) {
  let body = new this(context);

  body.createdAt = new Date(moment().utcOffset('7').format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]')),
  body.updatedAt = new Date(moment().utcOffset('7').format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]')),

  body = await body.save();
  return body;
}

module.exports = {
  customStore,
};
