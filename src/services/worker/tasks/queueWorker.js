const logger = require('winston');

const tasksController = require('../controllers/tasks.controller');

const processJob = async (job, done) => {
    logger.info('Job ' + job.id + ' "' + job.data.type + '" started');

    const startTime = new Date().getTime();

    try {
        switch (job.data.type) {
            case 'tasks.generateReport':
                await tasksController.generateReport(job.data);
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
    SERVICE.queueWorker.process(CONFIG.services.worker.queue.concurrency, processJob);
};

module.exports = task;
