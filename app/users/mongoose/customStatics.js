const moment = require('moment');

/**
* Update a timestamps
* @author Novans
* @param {Object} currentUser request CurentUser
* @api private
*/
function customTimestamps(currentUser) {
  const body = {
    by: currentUser.fullname,
    at: new Date(moment().utcOffset('7').format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]')),
    userId: currentUser.userId,
  };
  return body;
}

async function customStore(context, currentUser) {
  let item = new this(context);

  if (currentUser) {
    item.created = customTimestamps(currentUser);
    item.updated = customTimestamps(currentUser);
  }

  item = await item.save();
  return item;
}

module.exports = {
  customStore,
};
