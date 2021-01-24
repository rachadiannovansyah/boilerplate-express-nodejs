const express = require('express');

const app = express();

require('dotenv').config();
require('./setup/initialize')(app);
require('./setup/routes')(app);
require('./setup/database')();

process.on('uncaughtException', (err) => {
    console.log(err)
});

process.on('unhandledRejection', (err) => {
    console.log(err)
});

app.listen(process.env.APP_PORT, () => {
    console.log(`Listening to requests on http://127.0.0.1:${process.env.APP_PORT}`);
});

module.exports = app;