const util = require('util');
const jwt = require('jsonwebtoken');

const jwt_sign = util.promisify(jwt.sign);
const jwt_verify = util.promisify(jwt.verify);

const { secret } = CONFIG.credentials.jwt;
const { user_access_jwt_lifetime, user_refresh_jwt_lifetime } = CONFIG.settings;

const signUserAccessToken = async (user) => {
    const currentDate = new Date();
    const expiration = Math.floor(
        currentDate.setSeconds(currentDate.getSeconds() + user_access_jwt_lifetime).valueOf() / 1000,
    );

    const payload = {
        type: 'userAccess',
        sub: user._id,
        exp: expiration,
    };

    return {
        accessToken: await jwt_sign(payload, secret),
        accessExpiration: new Date(expiration * 1000),
    };
};

const verifyUserAccessToken = async (token) => {
    try {
        const decoded = await jwt_verify(token, secret);

        if (decoded.type !== 'userAccess') {
            return null;
        }

        return decoded;
    } catch (e) {
        return null;
    }
};

const signUserRefreshToken = async (user) => {
    const currentDate = new Date();
    const expiration = Math.floor(
        currentDate.setSeconds(currentDate.getSeconds() + user_refresh_jwt_lifetime).valueOf() / 1000,
    );

    const payload = {
        type: 'userRefresh',
        sub: user._id,
        exp: expiration,
    };

    return {
        refreshToken: await jwt_sign(payload, secret),
        refreshExpiration: new Date(expiration * 1000),
    };
};

const verifyUserRefreshToken = async (token) => {
    try {
        const decoded = await jwt_verify(token, secret);

        if (decoded.type !== 'userRefresh') {
            return null;
        }

        return decoded;
    } catch (e) {
        return null;
    }
};

module.exports = {
    signUserAccessToken,
    verifyUserAccessToken,
    signUserRefreshToken,
    verifyUserRefreshToken,
};
