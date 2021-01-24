const respond = require('../libraries/utils/payload');

module.exports = (req, res) => respond.resBadRequest(res, 'Request Not Found');
