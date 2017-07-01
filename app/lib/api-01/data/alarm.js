'use strict';

const _ = require('lodash');
const async = require('async');

function DataManager(options) {
    var me = this;
    me._databaseService = _.get(options, 'databaseService');
    me._config = _.get(options, 'config');
}

module.exports = DataManager;


DataManager.prototype.trigger = function (params, cb) {
    var me = this;
    me._databaseService.getClient(function(err, client, release) {
        var sql = `SELECT id, token FROM main.trigger_alarm($1::uuid, $2::float8, $3::float8, $4::float8);`;
        var queryParams = [];
        queryParams.push(_.get(params, 'userId'));
        queryParams.push(_.get(params, 'lat'));
        queryParams.push(_.get(params, 'lon'));
        queryParams.push(_.get(params, 'accuracy'));

        client.query(sql, queryParams, function (err, data) {
            release();
            return cb(err, data);
        });
    });
};

DataManager.prototype.list = function (params, cb) {
    var me = this;
    me._databaseService.getClient(function(err, client, release) {
    var sql = `SELECT
                 ST_X(a.geom) AS lon,
                 ST_Y(a.geom) AS lat,
                 a.accuracy
               FROM main.alarms a
               LEFT OUTER JOIN main.users b ON ST_Intersects(
                 a.geom,
                 ST_Transform(
                   ST_Buffer(
                     ST_Transform(b.geom, 3857),
                     50000000000
                   ),
                   4326
                 )
               )
               WHERE 
                 b.id = $1::uuid
                 AND a.status = 1`;

        var queryParams = [];
        queryParams.push(_.get(params, 'userId'));

        client.query(sql, queryParams, function (err, result) {
            release();
            var data = _.get(result, 'rows');
            console.log('DATA', _.size(data));
            return cb(err, data);
        });
    });
};

DataManager.prototype.cancel = function (params, cb) {
    var me = this;
    me._databaseService.getClient(function(err, client, release) {
        var sql = `UPDATE main.alarms a
                   SET status = 0
                   FROM main.users b
                   WHERE a.user_alt_id = b.alt_id
                   AND b.id = $1::uuid`;

        var queryParams = [];
        queryParams.push(_.get(params, 'userId'));

        client.query(sql, queryParams, function (err) {
            release();
            return cb(err);
        });
    });
};