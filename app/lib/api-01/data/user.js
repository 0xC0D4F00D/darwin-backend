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

DataManager.prototype.getView = function (params, cb) {
    var me = this;
    me._databaseService.getClient(function(err, client, release) {
        var sql = `SELECT row_to_json(fc) AS result FROM
                   (
                       SELECT
                           'FeatureCollection' AS type,
                           array_to_json(array_agg(f)) AS features
                       FROM
                       (
                         --
                          SELECT
                              'Feature' AS type,
                              ST_AsGeoJSON(ST_Transform(o.geom, 3857))::json AS geometry,
                              json_build_object('type', 'user', 'id', o.id) AS properties
                          FROM main.users AS o
                          WHERE EXTRACT(EPOCH FROM (now() - o.updated_at)) < 600
                          --
                          UNION ALL
                          --
                          SELECT
                              'Feature' AS type,
                              ST_AsGeoJSON(ST_Buffer(ST_Transform(z.geom, 3857), 5000, 10))::json AS geometry,
                              json_build_object('type', 'zone') AS properties
                          FROM main.users AS z
                          WHERE EXTRACT(EPOCH FROM (now() - z.updated_at)) < 600
                          --
                          UNION ALL
                          --
                          SELECT
                              'Feature' AS type,
                              ST_AsGeoJSON(ST_Transform(m.geom, 3857))::json AS geometry,
                              json_build_object('type', 'alarm', 'status', m.status) AS properties
                          FROM main.alarms AS m
                          WHERE m.updated_at IS NULL OR EXTRACT(EPOCH FROM (now() - m.updated_at)) < 600
                          --
                       ) AS f
                   ) AS fc;`;
        client.query(sql, function (err, data) {
            release();
            if (err) return cb(err);
            let result = _.get(data, ['rows', 0, 'result']);
            return cb(null, result);
        });
    });
};
