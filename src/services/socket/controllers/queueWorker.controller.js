const { socketEmit } = require('../../../common/helpers/socket.helper');
const logger = require('winston');

const emitTaskChange = async (data) => {
    const { projectId, action, task } = data;

    const room = 'project_' + projectId;

    const payload = {
        action,
        task,
    };

    await socketEmit('/', [room], 'task.change', payload);

    logger.info('Socket - Event task.change change emitted to room ' + room);
};

module.exports = { emitTaskChange };
