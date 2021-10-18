const { celebrate, Joi } = require('celebrate');

const login = celebrate({
    body: Joi.object().keys({
        identifier: Joi.string().required(),
        password: Joi.string().required(),
    }),
});

const refreshToken = celebrate({
    body: Joi.object().keys({
        refreshToken: Joi.string().required(),
    }),
});

module.exports = { login, refreshToken };
