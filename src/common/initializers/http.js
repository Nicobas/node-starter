const http = require('http');
const logger = require('winston');

module.exports = async (ms) => {
    logger.info('[HTTP] Initializing');

    const { app } = ms;

    logger.info('[HTTP] Initializing http without ssl');

    ms.httpServer = http.createServer(app);
};
