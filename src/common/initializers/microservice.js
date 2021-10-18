require('../prototypes');
const logger = require('winston');
const loggerInit = require('./logger');
const figletHelper = require('../helpers/figletHelper');
const CONFIG = require('../../../config/config');

module.exports.init = async (serviceName, initializers) => {
    figletHelper.showServiceTitle(serviceName);

    let ms = {
        serviceName: serviceName,
    };

    loggerInit(ms);

    logger.info('-------- ' + serviceName.toUpperCase() + ' --------');
    logger.info('[' + serviceName.toUpperCase() + '] Starting initialization');

    process.on('unhandledRejection', (err) => {
        logger.error(err.stack || err);
    });

    process.on('uncaughtException', (err) => {
        logger.error(err.stack || err);
    });

    try {
        const serviceConfig = CONFIG.common.services[serviceName];

        if (!serviceConfig) {
            throw new Error('Microservice need config');
        }

        await initializers.asyncForEach(async (item) => {
            await item(ms);
        });

        logger.info('[' + serviceName.toUpperCase() + '] Initialized SUCCESSFULLY');
    } catch (err) {
        logger.error(err.stack || err);
        logger.info('[' + serviceName.toUpperCase() + '] Initialisation FAILED');
    }
};
