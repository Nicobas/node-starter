const http = require('http');
const logger = require('winston');

const initializer = () => {
    return async () => {
        logger.info('[HTTP] Initializing');

        const { app } = SERVICE;

        logger.info('[HTTP] Initializing http without ssl');

        SERVICE.httpServer = http.createServer(app);
    };
};

module.exports = initializer;
