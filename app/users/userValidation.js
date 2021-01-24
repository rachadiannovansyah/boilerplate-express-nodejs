const Joi = require('@hapi/joi');

const create = {
  body: Joi.object({
    fullname: Joi.string()
      .required(),
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .required(),
  }),
};

module.exports = {
  create
};
