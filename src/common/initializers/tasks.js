const logger = require('winston');
const requiredir = require('require-dir');

const initializer = () => {
    return async () => {
        const { serviceName } = SERVICE;

        logger.info('[TASKS] Run tasks');

        const path = '../../services/' + serviceName + '/tasks/';
        const dirs = requiredir(path);

        // Run all tasks
        Object.values(dirs).forEach((item) => {
            item();
        });
    };
};

module.exports = initializer;
