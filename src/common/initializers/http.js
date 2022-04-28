const http = require('http');
const logger = require('winston');

module.exports = async () => {
    logger.info('[HTTP] Initializing');

    const { app } = SERVICE;

    logger.info('[HTTP] Initializing http without ssl');

    SERVICE.httpServer = http.createServer(app);
};
