const logger = require('winston');
const { errors } = require('celebrate');
const { MulterError } = require('multer');

const initializer = () => {
    return async () => {
        logger.info('[EXPRESS ERRORS] Handle body-parser errors');

        const { app } = SERVICE;

        app.use((err, req, res, next) => {
            if (err instanceof SyntaxError && err.status >= 400 && err.status < 500 && err.message.indexOf('JSON')) {
                res.status(400).json({
                    message: 'Bad body json format',
                    error: 'Bad body json format',
                });
            } else {
                next(err);
            }
        });

        logger.info('[EXPRESS ERRORS] Handle mutler errors');

        app.use((err, req, res, next) => {
            if (err instanceof MulterError) {
                res.status(400).json({
                    message: 'File error : ' + err.message,
                    error: 'File error : ' + err.message,
                });
            } else {
                next(err);
            }
        });

        logger.info('[EXPRESS ERRORS] Handle joi celebrate errors');

        app.use(errors());

        logger.info('[EXPRESS ERRORS] Handle payload errors');

        app.use((err, req, res, next) => {
            if (err instanceof Error && /PayloadTooLargeError/.test(err.stack)) {
                res.status(400).json({
                    message: 'Request entity too large',
                    error: 'Request entity too large',
                });
            } else {
                next(err);
            }
        });

        logger.info('[EXPRESS ERRORS] Handle uncaught errors');

        //eslint-disable-next-line no-unused-vars
        app.use((err, req, res, next) => {
            //-- laisser le next sinon erreur express
            const status = err.status || 500;
            if (CONFIG.env_type !== 'dev') {
                res.status(status).json({
                    message: err.message,
                    error: err.stack,
                });
            } else {
                res.status(status).json({ error: 'An error occurred ! T_T' });
            }

            logger.error(err.stack);
        });
    };
};

module.exports = initializer;
