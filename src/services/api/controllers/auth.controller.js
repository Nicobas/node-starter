const { response201WithData, response400WithMessage } = require('../../../common/helpers/expressRes.helper');
const {
    signUserAccessToken,
    signUserRefreshToken,
    verifyUserRefreshToken,
} = require('../../../common/helpers/jwt.helper');
const { comparePassword } = require('../../../common/helpers/crypto.helper');

const { User } = require('../../../common/models');

const login = async (req, res) => {
    const { identifier, password } = req.body;

    let filters = {
        status: 'Active',
        $or: [{ username: identifier }, { email: identifier }],
    };

    const user = await User.findOne(filters, '_id password_hash');

    if (!user) {
        return response400WithMessage(res, 'Authentication failed');
    }

    if (!(await comparePassword(password, user.password_hash))) {
        return response400WithMessage(res, 'Authentication failed');
    }

    user.last_authentication_date = req.currentDate;
    await user.save();

    const { accessToken, accessExpiration } = await signUserAccessToken(user);
    const { refreshToken, refreshExpiration } = await signUserRefreshToken(user);

    response201WithData(res, {
        user: {
            id: user._id,
            status: user.status,
        },
        accessToken,
        accessExpiration,
        refreshToken,
        refreshExpiration,
    });
};

const refreshToken = async (req, res) => {
    const decodedRefreshToken = await verifyUserRefreshToken(req.body.refreshToken);

    if (!decodedRefreshToken) {
        return response400WithMessage(res, 'Refresh token failed');
    }

    const user = await User.findOne({ status: 'Active', _id: decodedRefreshToken.sub }, '_id');

    if (!user) {
        return response400WithMessage(res, 'Refresh token failed');
    }

    user.last_authentication_date = req.currentDate;
    await user.save();

    const { accessToken, accessExpiration } = await signUserAccessToken(user);
    const { refreshToken, refreshExpiration } = await signUserRefreshToken(user);

    response201WithData(res, {
        user: {
            id: user._id,
        },
        accessToken,
        accessExpiration,
        refreshToken,
        refreshExpiration,
    });
};

module.exports = { login, refreshToken };
