const logger = require('winston');
const { createLogger, format, transports } = logger;

require('winston-daily-rotate-file');
const { consoleFormat } = require('winston-console-format');

const CONFIG = require('../../../config/config');

const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        http: 2,
        info: 3,
        debug: 4,
    },
};

const customFormat = format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

module.exports = (ms) => {
    logger.clear();

    logger.configure({
        levels: customLevels.levels,
        exitOnError: false,
    });

    logger.stream = {
        write: (message) => {
            logger.http(message.replace('\n', ''));
        },
    };

    if (CONFIG.common.logs.file) {
        const transportDailyFile = new logger.transports.DailyRotateFile({
            level: 'info',
            format: format.combine(format.timestamp(), customFormat),
            filename: '%DATE%.log',
            dirname: CONFIG.server.paths.logs + ms.serviceName + '/logs/',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '365d',
            handleExceptions: true,
        });

        logger.add(transportDailyFile);
    }

    if (CONFIG.common.logs.console) {
        const transportConsole = new logger.transports.Console({
            format: format.combine(format.timestamp(), customFormat),
            handleExceptions: true,
            level: 'debug',
        });

        logger.add(transportConsole);
    }

    if (CONFIG.common.logs.debug) {
        const transportDebug = createLogger({
            level: 'silly',
            format: format.combine(
                format.timestamp(),
                format.ms(),
                format.errors({ stack: true }),
                format.splat(),
                format.json(),
            ),
            transports: [
                new transports.Console({
                    format: format.combine(
                        format.colorize({ all: true }),
                        format.padLevels(),
                        consoleFormat({
                            showMeta: true,
                            metaStrip: ['timestamp', 'service'],
                            inspectOptions: {
                                depth: Infinity,
                                colors: true,
                                maxArrayLength: Infinity,
                                breakLength: 120,
                                compact: Infinity,
                            },
                        }),
                    ),
                }),
            ],
        });

        logger.add(transportDebug);
    }
};
