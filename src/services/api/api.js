const service = require('../../common/initializers/_service');

const mongoose = require('../../common/initializers/mongoose');
const express = require('../../common/initializers/express');
const expressStatus = require('../../common/initializers/express-status');
const expressRoutes = require('../../common/initializers/express-routes');
const expressErrors = require('../../common/initializers/express-errors');
const http = require('../../common/initializers/http');
const httpListen = require('../../common/initializers/http-listen');

const initializers = [mongoose, express, expressStatus, expressRoutes, expressErrors, http, httpListen];

service.init('api', initializers);
