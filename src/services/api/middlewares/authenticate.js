const { response401WithMessage } = require('../../../common/helpers/expressResHelper');
const { verifyUserAuthToken } = require('../../../common/helpers/jwtHelper');

const User = require('../../../common/models/User');

const authenticateUser = (fields = '') => {
    return async (req, res, next) => {
        if (!req.headers.authorization) {
            response401WithMessage(res, 'JWT authorization token is required');
            return;
        }

        const token = req.headers.authorization.replace('JWT ', '');

        const decodedAuthToken = await verifyUserAuthToken(token);

        if (!decodedAuthToken) {
            response401WithMessage(res, 'JWT authorization token is not valid');
            return;
        }

        const user = await User.findOne({ status: 'Active', _id: decodedAuthToken.userId }, '_id ' + fields);

        if (!user) {
            response401WithMessage(res, 'JWT authorization token is not valid');
            return;
        }

        req.userAuth = decodedAuthToken;
        req.me = user;

        next();
    };
};

module.exports = { authenticateUser };
