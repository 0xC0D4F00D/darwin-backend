const _ = require('lodash');
const pg = require('pg');

function DatabaseService(config) {
    var me = this;
    me._config = _.clone(config.connectionConfig, true) || {};

    me._pool = new pg.Pool(me._config);

    // Do a proper logging here
    me._pool.on('error', function (err) {
        console.error('Idle client error', err.message, err.stack)
    });

    me._pool.on('connect', function (err, client) {
        console.log('CONNECTION TO THE DB ESTABLISHED');
    });
}

module.exports = DatabaseService;


DatabaseService.prototype.getClient = function (cb) {
    var me = this;
    me._pool.connect(function(err, client, release) {
        if (err) {
            return console.error('Error fetching client from pool', err);
        }
        return cb(null, client, release);
    });
};