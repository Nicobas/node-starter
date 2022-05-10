const logger = require('winston');
const Queue = require('bee-queue');

const initializer = (queueName) => {
    return async () => {
        logger.info('[QUEUE PUSH] Initializing queue "' + queueName + '"');

        const queue = new Queue(queueName, {
            prefix: 'bq_' + queueName,
            stallInterval: 5000,
            nearTermWindow: 1200000,
            delayedDebounce: 1000,
            redis: { url: CONFIG.credentials.redis.uri },
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
