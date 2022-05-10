const validator = require('../validators/projects.validator');
const controller = require('../controllers/projects.controller');

const { authenticateUser } = require('../middlewares/authenticate.middleware');

module.exports = (router) => {
    router.route('/').post(validator.createProject, authenticateUser(), controller.createProject);

    router.route('/').get(validator.getProjects, authenticateUser(), controller.getProjects);
};
