const _ = require('lodash');
const async = require('async');
const https = require('https');
const querystring = require('querystring');

function TrackService(config) {
    let me = this;
    me._config = _.get(config, 'config');
    me._dataManager = _.get(config, 'dataManager');
}

module.exports = TrackService;

TrackService.prototype.registerPoints = function (params, cb) {
    let me = this;
    me._dataManager.track.registerPoints(params, cb);
};