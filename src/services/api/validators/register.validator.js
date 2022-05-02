const { celebrate, Joi } = require('celebrate');

const { USERNAME_PATTERN, PASSWORD_PATTERN } = require('../../../common/consts/userConsts');

const register = celebrate({
    body: Joi.object().keys({
        username: Joi.string().regex(USERNAME_PATTERN).required(),
        email: Joi.string().email().required(),
        password: Joi.string().regex(PASSWORD_PATTERN).required(),
    }),
});

const verifyUsername = celebrate({
    params: Joi.object().keys({
        username: Joi.string().regex(USERNAME_PATTERN).required(),
    }),
});

const verifyEmail = celebrate({
    params: Joi.object().keys({
        email: Joi.string().email().required(),
    }),
});

module.exports = { register, verifyUsername, verifyEmail };
