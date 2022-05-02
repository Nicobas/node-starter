const validator = require('../validators/me.validator');
const controller = require('../controllers/me.controller');

const { authenticateUser } = require('../middlewares/authenticate.middleware');

module.exports = (router) => {
    router
        .route('/profile')
        .get(
            validator.getProfile,
            authenticateUser('status username email register_mode last_authentication_date'),
            controller.getProfile,
        );
};
