'use strict';

global.rootRequire = function (name) {
    return require(__dirname + '/' + name);
};

const _ = require('lodash');
const async = require('async');
const fs = require('fs');
const yaml = require('js-yaml');
const Hapi = require('hapi');

const SERVER_PORT = 5000;

var config;

try {
    var text = fs.readFileSync('/etc/darwin/config.yml', 'utf8');
    config = yaml.safeLoad(text);
} catch (err) {
    throw new Error('Error reading configuration file. Details: ' + err.message);
}

const server = new Hapi.Server();

server.connection({ port: SERVER_PORT });

const pipeline = [];

const DatabaseService = rootRequire('/lib/api-01/services/database');
const databaseService = new DatabaseService({
    connectionConfig: {
        host     : _.get(config, 'db_connections.main.host'     , '127.0.0.1' ),
        port     : _.get(config, 'db_connections.main.port'     , 5432        ),
        database : _.get(config, 'db_connections.main.database'               ),
        user     : _.get(config, 'db_connections.main.user'                   ),
        password : _.get(config, 'db_connections.main.password'               ),
        max: 10,
        idleTimeoutMillis: 30000
    }
});

const DataManager = rootRequire('/lib/api-01/data');
const dataManager = new DataManager({
    databaseService: databaseService,
    config: config
});

var UserService = rootRequire('/lib/api-01/services/user');
var userService = new UserService({
    config: config,
    dataManager: dataManager
});

var userRoute = rootRequire('/lib/api-01/routes/user');

pipeline.push(function (cb) {
    server.register({
        register: userRoute,
        options: { userService: userService },
        routes: { prefix: '/api/v1/user' }
    }, cb);
});

// ----

var AlarmService = rootRequire('/lib/api-01/services/alarm');
var alarmService = new AlarmService({
    config: config,
    dataManager: dataManager
});

var alarmRoute = rootRequire('/lib/api-01/routes/alarm');

pipeline.push(function (cb) {
    server.register({
        register: alarmRoute,
        options: { alarmService: alarmService },
        routes: { prefix: '/api/v1/alarm' }
    }, cb);
});

// ----

pipeline.push(function (cb) {
    server.start(cb);
});

async.series(pipeline, function (err) {
    if (err) return console.error('Server failed during startup', err);
    console.log('Server running at: ', server.info.uri);
});
