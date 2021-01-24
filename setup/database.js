const config = require('config');
const mongoose = require('mongoose');

const url = config.get('db.mongoUrl');

const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    auto_reconnect: true,
    audoIndex: true,
    keepAlive: true,
    poolSize: 10,
    useCreateIndex: true,
};

module.exports = () => {
    mongoose.connect(url, dbOptions);

    mongoose.connection.on('error', () => {
        console.log('Could not connect to MongoDB')
    });

    mongoose.connection.on('disconnected', () => {
        console.log('Lost MongoDB connection')
    });

    mongoose.connection.on('connected', () => {
        console.log('Conencted to MongoDB')
    });

    mongoose.connection.on('reconnected', () => {
        console.log('Reconnected to MongoDB')
    });
}