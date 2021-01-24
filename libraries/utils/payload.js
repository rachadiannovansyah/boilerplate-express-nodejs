/*
    HELPER FOR BUILDING RESPONSE

    inspired from https://github.com/dimaskiddo/codebase-nodejs-rest/blob/master/helpers/utils/utils-response.js

    author:iqbalzetto
*/
const isProduction = (process.env.NODE_ENV === 'production');

const functions = {};

/**
* Send message response
* @param {Object} res express response object
* @param {Number} statusCode status code
* @param {Sting} msg message
* @param {Object} meta additional data
* @api public
*/
functions.respond = (res, statusCode, msg, meta) => {
  res.status(statusCode).send({
    status: true,
    code: statusCode,
    message: msg,
    meta,
  });
};

/**
* Send Response with data
* @param {Object} res express response object
* @param {Number} statusCode
* @param {Sting} msg message
* @param {Object} data
* @param {Object} meta additional data
* @api public
*/
functions.respondData = (res, statusCode, msg, data, meta) => {
  res.status(statusCode).send({
    status: true,
    code: statusCode,
    message: msg,
    data,
    meta,
  });
};
/**
* Send Response with token
* @param {Object} res express response object
* @param {Number} statusCode
* @param {Sting} msg message
* @param {Object} data
* @param {Object} meta additional data
* @api public
*/
functions.respondToken = (res, statusCode, msg, token, refreshToken) => {
  res.status(statusCode).send({
    status: true,
    code: statusCode,
    message: msg,
    token,
    refreshToken,
  });
};

/**
* Send error response
* @param {Object} res express response object
* @param {Number} statusCode
* @param {Sting} msg message
* @param {Object} err err object
* @param {Object} meta additional data
* @api public
*/
functions.respondError = (res, statusCode, msg, err, meta) => {
  const errors = err;

  if (errors && !isProduction) {
    errors.message = JSON.stringify(errors.message, ['stack', 'message', 'arguments', 'type', 'name', 'body', 'status', 'statusCode']);
    errors.message = JSON.parse(errors.message);
  }

  res.status(statusCode).send({
    status: false,
    code: statusCode,
    message: msg,
    errors,
    meta,
  });
};

/**
* Send success response, code:200
* @param {Object} res express response object
* @param {Sting} msg message
* @param {Object} meta additional data
* @api public
*/
functions.resSuccess = (res, msg, meta) => {
  msg = (msg !== undefined) ? msg : 'Success';
  functions.respond(res, 200, msg, meta);
};

/**
* Send success response with data
* @param {Object} res express response object
* @param {Sting} msg message
* @param {Object} data
* @param {Object} meta additional data
* @api public
*/
functions.resSuccessData = (res, msg, data, meta) => {
  msg = (msg !== undefined) ? msg : 'Success';
  if (meta !== undefined) {
    meta.count = data.length;
  }
  functions.respondData(res, 200, msg, data, meta);
};
/**
* Send success response with data No Change
* @param {Object} res express response object
* @param {Sting} msg message
* @param {Object} data
* @param {Object} meta additional data
* @api public
*/
functions.resSuccessDataNoChange = (res, msg, data, meta) => {
  msg = (msg !== undefined) ? msg : 'Success';
  if (meta !== undefined) {
    meta.count = data.length;
  }
  functions.respondData(res, 203, msg, data, meta);
};

/**
* Send successful created response with data
* @param {Object} res express response object
* @param {Sting} msg message
* @param {Object} data
* @param {Object} meta additional data
* @api public
*/
functions.resCreated = (res, msg, data, meta) => {
  msg = (msg !== undefined) ? msg : 'Created';
  if (meta !== undefined) {
    meta.count = count(data);
  }
  functions.respondData(res, 201, msg, data, meta);
};
/**
* Send successful updated response with data
* @param {Object} res express response object
* @param {Sting} msg message
* @param {Object} data
* @param {Object} meta additional data
* @api public
*/
functions.resUpdated = (res, msg, data, meta) => {
  msg = (msg !== undefined) ? msg : 'Updated';
  if (meta !== undefined) {
    meta.count = count(data);
  }
  functions.respondData(res, 200, msg, data, meta);
};

/**
* Send not found response
* @param {Object} res express response object
* @param {Sting} msg message
* @param {Object} err
* @param {Object} meta additional data
* @api public
*/
functions.resBadRequest = (res, msg, err, meta) => {
  msg = (msg !== undefined) ? msg : 'Bad Request';
  functions.respondError(res, 400, msg, err, meta);
};

/**
* Send not found response
* @param {Object} res express response object
* @param {Sting} msg message
* @param {Object} err
* @param {Object} meta additional data
* @api public
*/
functions.resUnauthorized = (res, msg, err, meta) => {
  msg = (msg !== undefined) ? msg : 'Unauthorized';
  functions.respondError(res, 401, msg, err, meta);
};

/**
* Send forbidden response
* @param {Object} res express response object
* @param {Sting} msg message
* @param {Object} err
* @param {Object} meta additional data
* @api public
*/
functions.resForbidden = (res, msg, err, meta) => {
  msg = (msg !== undefined) ? msg : 'Forbidden';
  functions.respondError(res, 403, msg, err, meta);
};

/**
* Send not found response
* @param {Object} res express response object
* @param {Sting} msg message
* @param {Object} err
* @param {Object} meta additional data
* @api public
*/
functions.resNotFound = (res, msg, err, meta) => {
  msg = (msg !== undefined) ? msg : 'Not found';
  functions.respondError(res, 404, msg, err, meta);
};

/**
* Send not found response
* @param {Object} res express response object
* @param {Sting} msg message
* @param {Object} err
* @param {Object} meta additional data
* @api public
*/
functions.resInternalServerError = (res, msg, err, meta) => {
  msg = (msg !== undefined) ? msg : 'Internal Server Error';

  functions.respondError(res, 500, msg, err, meta);
};

/**
* Send not found response
* @param {Object} res express response object
* @param {Sting} msg message
* @param {Object} meta additional errors
*/
functions.resValidationError = (res, msg, errors) => {
  res.status(400).send({
    status: false,
    code: 400,
    message: msg,
    errors,
  });
};

module.exports = functions;
