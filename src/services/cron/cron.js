const service = require('../../common/initializers/_service');

const mongoose = require('../../common/initializers/mongoose');
const tasks = require('../../common/initializers/tasks');

const initializers = [mongoose(), tasks()];

service.init('cron', initializers);
