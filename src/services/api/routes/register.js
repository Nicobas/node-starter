const validator = require('../validators/register.validator');
const controller = require('../controllers/register.controller');

module.exports = (router) => {
    router.route('/').post(validator.register, controller.register);

    router.route('/verifyUsername/:username').get(validator.verifyUsername, controller.verifyUsername);

    router.route('/verifyEmail/:email').get(validator.verifyEmail, controller.verifyEmail);
};
