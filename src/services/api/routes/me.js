const validator = require('../validators/meValidator');
const controller = require('../controllers/meController');

const { authenticateUser } = require('../middlewares/authenticate');

module.exports = (router) => {
    router
        .route('/profile')
        .get(
            validator.getProfile,
            authenticateUser('status username email register_mode last_authentication_date'),
            controller.getProfile,
        );
};
