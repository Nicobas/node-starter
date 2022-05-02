const service = require('../../common/initializers/_service');

const mongoose = require('../../common/initializers/mongoose');
const express = require('../../common/initializers/express');
const expressStatus = require('../../common/initializers/expressStatus');
const expressRoutes = require('../../common/initializers/expressRoutes');
const expressErrors = require('../../common/initializers/expressErrors');
const queuePush = require('../../common/initializers/queuePush');
const http = require('../../common/initializers/http');
const httpListen = require('../../common/initializers/httpListen');

const initializers = [
    mongoose(),
    express(),
    expressStatus(),
    expressRoutes(),
    expressErrors(),
    queuePush('worker'),
    http(),
    httpListen(),
];

service.init('api', initializers);
