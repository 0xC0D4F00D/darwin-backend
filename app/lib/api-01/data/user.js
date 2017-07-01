'use strict';

const _ = require('lodash');
const async = require('async');

function DataManager(options) {
    var me = this;
    me._databaseService = _.get(options, 'databaseService');
    me._config = _.get(options, 'config');
}

module.exports = DataManager;

DataManager.prototype.updatePushToken = function (params, cb) {
    var me = this;
    me._databaseService.getClient(function(err, client, release) {
        var sql = `SELECT * FROM main.update_push_token($1::uuid, $2::text, $3::text);`;
        var queryParams = [];
        queryParams.push(_.get(params, 'userId'));
        queryParams.push(_.get(params, 'token'));
        queryParams.push(_.get(params, 'platform'));

        client.query(sql, queryParams, function (err, data) {
            release();
            if (err) return cb(err);
            var result = _.get(data, ['rows', 0]);
            console.log('RRR:', result);
            return cb(err, result);
        });
    });
};

DataManager.prototype.updateLocation = function (params, cb) {
    var me = this;
    me._databaseService.getClient(function(err, client, release) {
        var sql = `SELECT main.update_location($1::uuid, $2::float8, $3::float8, $4::float8);`;
        var queryParams = [];
        queryParams.push(_.get(params, 'userId'));
        queryParams.push(_.get(params, 'lat'));
        queryParams.push(_.get(params, 'lon'));
        queryParams.push(_.get(params, 'accuracy'));

        client.query(sql, queryParams, function (err) {
            release();
            return cb(err);
        });
    });
};