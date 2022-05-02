const validator = require('../validators/auth.validator');
const controller = require('../controllers/auth.controller');

module.exports = (router) => {
    router.route('/login').post(validator.login, controller.login);

    router.route('/refreshToken').post(validator.refreshToken, controller.refreshToken);
};
