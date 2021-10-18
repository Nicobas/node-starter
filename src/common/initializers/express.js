const express = require('express');
const bodyParser = require('body-parser'); //... voir si inclut dans express
const morgan = require('morgan');
const logger = require('winston');
const helmet = require('helmet');
const compression = require('compression');

const CONFIG = require('../../../config/config');

module.exports = (ms) => {
    logger.info('[EXPRESS] Initializing');

    const { serviceName } = ms;

    const httpConfig = CONFIG.common.services[serviceName].http;

    if (!httpConfig) {
        throw new Error('Microservice need http config');
    }

    const app = express();

    logger.info('[EXPRESS] Initializing req/res');

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', '*');
        res.header('Access-Control-Allow-Headers', '*');

        if (httpConfig.is_nginx_proxy_enabled && !req.headers['x-forwarded-for']) {
            logger.warn('Proxy X-Forwarded-For header unknown');
            req.clientIp = req.connection.remoteAddress;
            res.status(407).json();
            return;
        } else if (httpConfig.is_nginx_proxy_enabled) {
            req.clientIp = req.headers['x-forwarded-for'];
        } else {
            req.clientIp = req.connection.remoteAddress;
        }

        req.currentDate = new Date();
        next();
    });

    logger.info('[EXPRESS] Initializing logger');

    morgan.token('remote-addr', (req) => {
        return req.clientIp;
    });

    app.use(morgan(CONFIG.common.env_type === 'dev' ? 'dev' : 'short', { stream: logger.stream }));

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

    ms.app = app;
};
