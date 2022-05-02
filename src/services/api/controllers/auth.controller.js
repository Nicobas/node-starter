const { response201WithData, response400WithMessage } = require('../../../common/helpers/expressResHelper');
const {
    signUserAccessToken,
    signUserRefreshToken,
    verifyUserRefreshToken,
} = require('../../../common/helpers/jwtHelper');
const { comparePassword } = require('../../../common/helpers/cryptoHelper');

const { User } = require('../../../common/models');

const login = async (req, res) => {
    const { identifier, password } = req.body;

    let filters = {
        status: 'Active',
        $or: [{ username: identifier }, { email: identifier }],
    };

    const user = await User.findOne(filters, '_id password_hash');

    if (!user) {
        response400WithMessage(res, 'Authentication failed');
        return;
    }

    if (!(await comparePassword(password, user.password_hash))) {
        response400WithMessage(res, 'Authentication failed');
        return;
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
        response400WithMessage(res, 'Refresh token failed');
        return;
    }

    const user = await User.findOne({ status: 'Active', _id: decodedRefreshToken.sub }, '_id');

    if (!user) {
        response400WithMessage(res, 'Refresh token failed');
        return;
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
