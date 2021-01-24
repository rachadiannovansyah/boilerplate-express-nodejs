require('express-async-errors');
const UserRouter = require('../app/users/userAPI');
const requestNotFound = require('../middlewares/requestNotFound');
const error = require('../middlewares/error');

module.exports = (app) => {
    app.use('/api/users', UserRouter);
    app.use(requestNotFound);
    app.use(error);
}