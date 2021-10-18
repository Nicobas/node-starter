const validator = require('../validators/tasksValidator');
const controller = require('../controllers/tasksController');

const { authenticateUser } = require('../middlewares/authenticate');
const { loadTaskFromParams } = require('../middlewares/tasks');

module.exports = (router) => {
    router.route('/').post(validator.createTask, authenticateUser('username'), controller.createTask);

    router.route('/').get(validator.getTasks, authenticateUser(), controller.getTasks);

    router
        .route('/:taskId')
        .get(
            validator.getTask,
            authenticateUser(),
            loadTaskFromParams('title description due_date status _author'),
            controller.getTask,
        );

    router
        .route('/:taskId')
        .put(
            validator.updateTask,
            authenticateUser(),
            loadTaskFromParams('title description due_date status _author'),
            controller.updateTask,
        );

    router
        .route('/:taskId')
        .delete(validator.deleteTask, authenticateUser(), loadTaskFromParams('_author'), controller.deleteTask);
};
