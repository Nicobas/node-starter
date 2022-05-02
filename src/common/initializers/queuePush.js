const logger = require('winston');
const beequeue = require('bee-queue');

const initializer = (queueName) => {
    return async () => {
        logger.info('[QUEUE PUSH] Initializing queue "' + queueName + '"');

        const queue = new beequeue(queueName, {
            prefix: 'bq_' + queueName,
            stallInterval: 5000,
            nearTermWindow: 1200000,
            delayedDebounce: 1000,
            redis: CONFIG.credentials.redis,
            isWorker: false,
            getEvents: true,
            sendEvents: true,
            storeJobs: true,
            ensureScripts: true,
            activateDelayedJobs: false,
            removeOnSuccess: false,
            removeOnFailure: false,
            redisScanCount: 100,
        });

        if (!SERVICE.queues) {
            SERVICE.queues = {};
        }

        SERVICE.queues[queueName] = queue;
    };
};

module.exports = initializer;
