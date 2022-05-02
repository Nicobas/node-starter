const multer = require('multer');

const validator = require('../validators/me.validator');
const controller = require('../controllers/me.controller');

const { authenticateUser } = require('../middlewares/authenticate.middleware');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = (router) => {
    router
        .route('/profile')
        .get(
            validator.getProfile,
            authenticateUser('status username email register_mode last_authentication_date avatar'),
            controller.getProfile,
        );

    router
        .route('/avatar')
        .put(upload.single('file'), validator.setAvatar, authenticateUser('avatar'), controller.setAvatar);
};
