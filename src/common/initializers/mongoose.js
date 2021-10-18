const logger = require('winston');
const mongoose = require('mongoose');
const requiredir = require('require-dir');

const CONFIG = require('../../../config/config');

module.exports = (ms) => {
    logger.info('[MONGOOSE] Connection to mongodb');

    if (!CONFIG.common.authentication_credentials.mongodb_uri) {
        throw new Error('Microservice needs mongodb credentials');
    }

    mongoose.Promise = global.Promise;
    mongoose.connect(CONFIG.common.authentication_credentials.mongodb_uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    logger.info('[MONGOOSE] Load models');

    const path = '../models/';
    requiredir(path);
};
