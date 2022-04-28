const express = require('express');
const bodyParser = require('body-parser'); //... voir si inclut dans express
const morgan = require('morgan');
const logger = require('winston');
const helmet = require('helmet');
const compression = require('compression');

module.exports = () => {
    logger.info('[EXPRESS] Initializing');

    const { serviceName } = SERVICE;

    const httpConfig = CONFIG.services[serviceName].http;

    if (!httpConfig) {
        throw new Error('Microservice need http config');
    }

    const app = express();

    logger.info('[EXPRESS] Initializing req/res');

    app.enable('trust proxy');

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', '*');
        res.header('Access-Control-Allow-Headers', '*');

        req.clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        req.currentDate = new Date();

        next();
    });

    logger.info('[EXPRESS] Initializing logger');

    morgan.token('remote-addr', (req) => {
        return req.clientIp;
    });

    app.use(morgan(CONFIG.env_type !== 'prod' ? 'dev' : 'short', { stream: logger.stream }));

    logger.info('[EXPRESS] Initializing security and compression');

    let bodyParserConfig = {
        extended: true,
    };

    if (httpConfig.max_request_body_size) {
        bodyParserConfig.limit = httpConfig.max_request_body_size;
    }

    app.use(bodyParser.json(bodyParserConfig));
    app.use(bodyParser.urlencoded({ ...bodyParserConfig, extended: true }));

    app.use(helmet());
    app.use(compression());

    SERVICE.app = app;
};
