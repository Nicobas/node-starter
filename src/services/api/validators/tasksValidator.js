const { celebrate, Joi } = require('celebrate');

const CONFIG = require('../../../../config/config');

const createTask = celebrate({
    body: Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string(),
        dueDate: Joi.date(),
        status: Joi.string()
            .valid(...CONFIG.common.settings.tasks_status)
            .required(),
    }),
});

const getTasks = celebrate({
    query: Joi.object().keys({
        search: Joi.string(),
        status: Joi.string().valid(...CONFIG.common.settings.tasks_status),
        limit: Joi.number().integer().min(1).max(50).default(20),
        offset: Joi.number().integer().min(0).default(0),
    }),
});

const getTask = celebrate({
    params: Joi.object().keys({
        taskId: Joi.objectId().required(),
    }),
});

const updateTask = celebrate({
    params: Joi.object().keys({
        taskId: Joi.objectId().required(),
    }),
    body: Joi.object().keys({
        title: Joi.string(),
        description: Joi.string(),
        dueDate: Joi.date(),
        status: Joi.string().valid(...CONFIG.common.settings.tasks_status),
    }),
});

const deleteTask = celebrate({
    params: Joi.object().keys({
        taskId: Joi.objectId().required(),
    }),
});

module.exports = {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask,
};