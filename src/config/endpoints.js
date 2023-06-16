'use strict'

function initWebEndpoints(app){
    app.use(require('../routes/index.js'));
}

function initWSEndpoints(app){
}

module.exports = {
    initWebEndpoints,
    initWSEndpoints
}