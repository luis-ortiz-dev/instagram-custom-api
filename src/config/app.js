'use strict'

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const xhub = require('express-x-hub');
const path = require('path');
const __root = path.resolve();
const { NODE_ENV } = require('./env');
const endpoints = require('./endpoints');

// Configuration
app.disable('x-powered-by');
app.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET }));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', __root + '/src/views');
app.set('layout', 'layouts/layout');
app.use(express.static(__root + '/src/public'));

// Init WS
endpoints.initWSEndpoints(app);
endpoints.initWebEndpoints(app);

module.exports = app;