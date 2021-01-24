const express= require('express');
const cors = require('cors');
const helmet = require('helmet');

module.exports = (app) => {
    // secure various HTTP headers with helmet
    app.use(helmet());

    // parse json request body
    app.use(express.json());

    // parse urlencoded request body
    app.use(express.urlencoded({ extended: true }));

    // enable cors
    app.use(cors());
}