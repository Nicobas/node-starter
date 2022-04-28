const logger = require('winston');

const listen = async (server, port) => {
    return new Promise((resolve) => {
        server.listen(port, () => {
            resolve();
        });
    });
};

module.exports = async () => {
    const { serviceName, httpServer } = SERVICE;

    const httpConfig = CONFIG.services[serviceName].http;

    if (!httpConfig) {
        throw new Error('Microservice need http config');
    }

    await listen(httpServer, httpConfig.port);

    logger.info('[HTTP LISTEN] Listening on port ' + httpConfig.port);
};
