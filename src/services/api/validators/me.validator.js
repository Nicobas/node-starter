const { celebrate, Joi } = require('celebrate');

const getProfile = celebrate({
    params: Joi.object().keys({}),
});

const setAvatar = celebrate({
    params: Joi.object().keys({}),
});

module.exports = {
    getProfile,
    setAvatar,
};
