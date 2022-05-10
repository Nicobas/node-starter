const { response401WithMessage } = require('../../../common/helpers/expressRes.helper');
const { verifyUserAccessToken } = require('../../../common/helpers/jwt.helper');

const { User } = require('../../../common/models');

const authenticateUser = (fields = '') => {
    return async (req, res, next) => {
        if (!req.headers.authorization) {
            response401WithMessage(res, 'JWT access token is required (Authorization header)');
            return;
        }

        const token = req.headers.authorization.replace('JWT ', '');

        const decodedAccessToken = await verifyUserAccessToken(token);

        if (!decodedAccessToken) {
            response401WithMessage(res, 'JWT access token is not valid');
            return;
        }

        const user = await User.findOne({ status: 'Active', _id: decodedAccessToken.sub }, '_id ' + fields);

        if (!user) {
            response401WithMessage(res, 'JWT access token is not valid');
            return;
        }

        req.userAuth = decodedAccessToken;
        req.me = user;

        next();
    };
};

module.exports = { authenticateUser };
