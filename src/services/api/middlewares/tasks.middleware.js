const { response404WithMessage, response500WithMessage } = require('../../../common/helpers/expressResHelper');

const { Task } = require('../../../common/models');

const loadTaskFromParams = (fields = '') => {
    return async (req, res, next) => {
        if (!req.me) {
            response500WithMessage(res, 'authenticateUser middleware required');
            return;
        }

        const task = await Task.findById(req.params.taskId, '_id ' + fields);

        if (!task) {
            response404WithMessage(res, 'Task not found');
            return;
        }

        req.task = task;

        next();
    };
};

module.exports = { loadTaskFromParams };
