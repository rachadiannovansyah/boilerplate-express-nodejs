const express = require('express');
const { validate } = require('express-validation');
const UserController = require('./userController');
const {
    create
  } = require('./userValidation');

const router = express.Router();

router.get('/', UserController.index);

router.post('/', validate(create, {}, { abortEarly: false }), UserController.store);

module.exports = router;