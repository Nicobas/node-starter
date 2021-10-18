const logger = require('winston');

const CONFIG = require('../../../config/config');

const listen = async (server, port) => {
    return new Promise((resolve) => {
        server.listen(port, () => {
            resolve();
        });
    });
};

module.exports = async (ms) => {
    const { serviceName, httpServer } = ms;

    const httpConfig = CONFIG.common.services[serviceName].http;

    if (!httpConfig) {
        throw new Error('Microservice need http config');
    }

    await listen(httpServer, httpConfig.port);

    logger.info('[HTTP LISTEN] Listening on port ' + httpConfig.port);
};
