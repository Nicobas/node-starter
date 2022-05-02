const logger = require('winston');
const figlet = require('figlet');

const configInit = require('./_config');
const loggerInit = require('./_logger');
const prototypesInit = require('./_prototypes');

const showServiceTitle = (serviceName) => {
    //eslint-disable-next-line no-console
    console.info('\n');

    const title = figlet.textSync(CONFIG.project_name.toUpperCase() + ' ' + serviceName.toUpperCase(), {
        font: 'Doom',
        horizontalLayout: 'default',
        verticalLayout: 'default',
    });

    //eslint-disable-next-line no-console
    console.info(title);
};

const init = async (serviceName, initializers) => {
    global.SERVICE = {
        serviceName: serviceName,
    };

    const serviceNameUpperCase = serviceName.toUpperCase();

    await configInit();
    await loggerInit();
    await prototypesInit();

    try {
        showServiceTitle(serviceName);

        logger.info('-------- ' + serviceNameUpperCase + ' --------');
        logger.info('[' + serviceNameUpperCase + '] Starting initialization');
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

        logger.info('[' + serviceNameUpperCase + '] Initialized SUCCESSFULLY');
    } catch (err) {
        logger.error(err.stack || err);
        logger.info('[' + serviceNameUpperCase + '] Initialisation FAILED');
    }
};

module.exports = {
    init,
};
