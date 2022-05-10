const { celebrate, Joi } = require('celebrate');

const createProject = celebrate({
    body: Joi.object().keys({
        title: Joi.string().required(),
    }),
});

const getProjects = celebrate({
    query: Joi.object().keys({
        search: Joi.string(),
        limit: Joi.number().integer().min(1).max(50).default(20),
        offset: Joi.number().integer().min(0).default(0),
    }),
});

module.exports = {
    createProject,
    getProjects,
};
