let { Joi } = require('celebrate');
const joiObjectId = require('joi-objectid');

Joi.objectId = joiObjectId(Joi);
