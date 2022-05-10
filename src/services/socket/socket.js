const service = require('../../common/initializers/_service');

const mongoose = require('../../common/initializers/mongoose');
const express = require('../../common/initializers/express');
const expressStatus = require('../../common/initializers/expressStatus');
const http = require('../../common/initializers/http');
const socket = require('../../common/initializers/socket');
const queueWorker = require('../../common/initializers/queueWorker');
const tasks = require('../../common/initializers/tasks');
const httpListen = require('../../common/initializers/httpListen');

const initializers = [mongoose(), express(), expressStatus(), queueWorker(), tasks(), http(), socket(), httpListen()];

service.init('socket', initializers);
