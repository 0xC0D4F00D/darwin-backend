'use strict';

const _ = require('lodash');
const async = require('async');

function DataManager(options) {
    let me = this;
    me._databaseService = _.get(options, 'databaseService');
    me._config = _.get(options, 'config');
}

module.exports = DataManager;

DataManager.prototype.registerPoints = function (params, cb) {
    let me = this;
    me._databaseService.getClient(function(err, client, release) {
        if (err) return cb(err);
        let sql = `SELECT * FROM main.register_track_points($1::jsonb) AS result;`;
        let queryParams = [];
        try {
            queryParams.push(JSON.stringify(_.get(params, 'trackingPointsData')));
        } catch (err) {
            return cb(new Error('Error during stringification of the tracking points data.', err));
        }
        client.query(sql, queryParams, function (err, data) {
            release();
            if (err) return cb(err);
            let result = _.get(data, ['rows', 0, 'result']);
            return cb(err, result);
        });
    });
};