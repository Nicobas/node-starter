const logger = require('winston');

const controller = require('../controllers/queueWorker.controller');

const processJob = async (job, done) => {
    logger.info('Job ' + job.id + ' "' + job.data.type + '" started');

    const startTime = new Date().getTime();

    try {
        switch (job.data.type) {
            case 'socket.emitTaskChange':
                await controller.emitTaskChange(job.data);
                break;
            default:
                logger.warn('Job type "' + job.data.type + '" not implemented');
                break;
        }

        done(null);
    } catch (e) {
        logger.error('Job ' + job.id + ' "' + job.data.type + '" error : ' + e);
        done(e);
    }

    logger.info(
        'Job ' + job.id + ' "' + job.data.type + '" ended : ' + (new Date().getTime() - startTime) / 1000 + 's',
    );
};

const task = () => {
    const { queueWorker, serviceName } = SERVICE;

    queueWorker.process(CONFIG.services[serviceName].queue.concurrency, processJob);
};

module.exports = task;
