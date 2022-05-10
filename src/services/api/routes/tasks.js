const validator = require('../validators/tasks.validator');
const controller = require('../controllers/tasks.controller');

const { authenticateUser } = require('../middlewares/authenticate.middleware');
const { loadTaskFromParams } = require('../middlewares/tasks.middleware');

module.exports = (router) => {
    router.route('/').post(validator.createTask, authenticateUser('username'), controller.createTask);

    router.route('/').get(validator.getTasks, authenticateUser(), controller.getTasks);

    router
        .route('/:taskId')
        .get(
            validator.getTask,
            authenticateUser(),
            loadTaskFromParams('title description due_date status _project _author'),
            controller.getTask,
        );

    router
        .route('/:taskId')
        .put(
            validator.updateTask,
            authenticateUser(),
            loadTaskFromParams('title description due_date status _project _author'),
            controller.updateTask,
        );

    router
        .route('/:taskId')
        .delete(
            validator.deleteTask,
            authenticateUser(),
            loadTaskFromParams('_project _author'),
            controller.deleteTask,
        );

    router
        .route('/:taskId/generateReport')
        .post(validator.generateTaskReport, authenticateUser(), loadTaskFromParams(''), controller.generateTaskReport);
};
