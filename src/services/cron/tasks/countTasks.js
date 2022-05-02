const logger = require('winston');
const { scheduleJob } = require('node-schedule');

const { Task } = require('../../../common/models');

const cronName = 'countTasks';

const process = async () => {
    const tasks = await Task.find({}, '_id status');

    const todoTasks = tasks.filter((o) => o.status === 'Todo');

    logger.debug('Total tasks : ' + tasks.length);
    logger.debug('Todo tasks : ' + todoTasks.length);
};

const task = () => {
    scheduleJob(CONFIG.services.cron.schedules.countTasks, async () => {
        logger.info('Cron "' + cronName + '" started');

        const startTime = new Date().getTime();

        await process();

        logger.info('Cron "' + cronName + '" ended : ' + (new Date().getTime() - startTime) / 1000 + 's');
    });
};

module.exports = task;
