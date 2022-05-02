const logger = require('winston');
const mongoose = require('mongoose');

const mongooseConnect = async (uri, options) => {
    return new Promise((resolve, reject) => {
        mongoose.Promise = global.Promise;
        mongoose.connect(uri, options, (err) => {
            err ? reject(err) : resolve();
        });
    });
};

const initializer = () => {
    return async () => {
        logger.info('[MONGOOSE] Connection to mongodb');

        const { uri } = CONFIG.credentials.mongodb;

        if (!uri) {
            throw new Error('Microservice needs mongodb credentials');
        }

        await mongooseConnect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        logger.info('[MONGOOSE] Load models');

        require('../models/index');
    };
};

module.exports = initializer;
