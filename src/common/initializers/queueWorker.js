const logger = require('winston');
const Queue = require('bee-queue');

const initializer = () => {
    return async () => {
        const { serviceName } = SERVICE;

        logger.info('[QUEUE WORKER] Initializing queue ' + serviceName);

        const queue = new Queue(serviceName, {
            prefix: 'bq_' + serviceName,
            stallInterval: 5000,
            nearTermWindow: 1200000,
            delayedDebounce: 1000,
            redis: { url: CONFIG.credentials.redis.uri },
            isWorker: true,
            getEvents: true,
            sendEvents: true,
            storeJobs: true,
            ensureScripts: true,
            activateDelayedJobs: true,
            removeOnSuccess: false,
            removeOnFailure: false,
            redisScanCount: 100,
        });

        SERVICE.queueWorker = queue;
    };
};

module.exports = initializer;
