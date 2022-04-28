const logger = require('winston');

const configInit = require('./_config');
const loggerInit = require('./_logger');
const prototypesInit = require('./_prototypes');

const figletHelper = require('../helpers/figletHelper');

module.exports.init = async (serviceName, initializers) => {
    global.SERVICE = {
        serviceName: serviceName,
    };

    await configInit();
    await loggerInit();
    await prototypesInit();

    try {
        figletHelper.showServiceTitle(serviceName);

        logger.info('-------- ' + serviceName.toUpperCase() + ' --------');
        logger.info('[' + serviceName.toUpperCase() + '] Starting initialization');
        logger.info('[CONFIG] Loaded');
        logger.info('[LOGGER] Initialized');

        process.on('unhandledRejection', (err) => {
            logger.error(err.stack || err);
        });

        process.on('uncaughtException', (err) => {
            logger.error(err.stack || err);
        });

        const serviceConfig = CONFIG.services[serviceName];

        if (!serviceConfig) {
            throw new Error('Microservice need config');
        }

        await initializers.asyncForEach(async (item) => {
            await item();
        });

        logger.info('[' + serviceName.toUpperCase() + '] Initialized SUCCESSFULLY');
    } catch (err) {
        logger.error(err.stack || err);
        logger.info('[' + serviceName.toUpperCase() + '] Initialisation FAILED');
    }
};
