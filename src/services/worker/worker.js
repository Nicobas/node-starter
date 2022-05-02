const service = require('../../common/initializers/_service');

const mongoose = require('../../common/initializers/mongoose');
const tasks = require('../../common/initializers/tasks');
const queueWorker = require('../../common/initializers/queueWorker');

const initializers = [mongoose(), queueWorker(), tasks()];

service.init('worker', initializers);
