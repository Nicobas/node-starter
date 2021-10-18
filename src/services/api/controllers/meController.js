const { response200WithData } = require('../../../common/helpers/expressResHelper');

const getProfile = async (req, res) => {
    response200WithData(res, {
        id: req.me._id,
        status: req.me.status,
        username: req.me.username,
        email: req.me.email,
        registerMode: req.me.register_mode,
        lastAuthenticationDate: req.me.last_authentication_date,
    });
};

module.exports = {
    getProfile,
};
