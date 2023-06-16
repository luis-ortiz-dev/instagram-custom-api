'use strict'

const { apiV1 } = require('./versions');

function initWebEndpoints(app){
    app.use(require('../routes/web/index.js'));
}

function initWSEndpoints(app){
}

module.exports = {
    initWebEndpoints,
    initWSEndpoints
}