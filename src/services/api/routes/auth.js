const validator = require('../validators/authValidator');
const controller = require('../controllers/authController');

module.exports = (router) => {
    router.route('/login').post(validator.login, controller.login);

    router.route('/refreshToken').post(validator.refreshToken, controller.refreshToken);
};
