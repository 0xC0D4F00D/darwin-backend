const _ = require('lodash');
const async = require('async');

function AlarmService(config) {
    let me = this;
    me._config = _.get(config, 'config');
    me._dataManager = _.get(config, 'dataManager');
}

module.exports = AlarmService;

AlarmService.prototype.trigger = function (params, cb) {
    let me = this;
    console.log('triggerAlarm', params);
    me._dataManager.alarm.trigger(params, function (err, data) {
        if (err) return cb(err);
        var users = _.get(data, 'rows');
        async.eachSeries(users, function (user, cb) {
            let id = _.get(user, 'id');
            let token = _.get(user, 'token');
            console.log('PUSH NOTIFICATION TO USER WITH ID', id, 'AND TOKEN', token);
            return cb();
        }, cb);
    });
};

AlarmService.prototype.list = function (params, cb) {
    let me = this;
    console.log('listAlarms', params);
    me._dataManager.alarm.list(params, function (err, data) {
        if (err) return cb(err);
        var result = {};
        if (_.size(data) > 0) {
            let minLon = Number.POSITIVE_INFINITY;
            let minLat = Number.POSITIVE_INFINITY;
            let maxLon = Number.NEGATIVE_INFINITY;
            let maxLat = Number.NEGATIVE_INFINITY;
            for (let i = 0, ii = _.size(data); i < ii; i++) {
                let item = data[i];
                let lon = item.lon;
                let lat = item.lat;
                if (lon < minLon) minLon = lon;
                if (lat < minLat) minLat = lat;
                if (lon > maxLon) maxLon = lon;
                if (lat > maxLat) maxLat = lat;
            }
            result.bbox = [minLon, minLat, maxLon, maxLat];
            result.alarms = data;
        }
        return cb(null, result);
    });
};

AlarmService.prototype.cancel = function (params, cb) {
    let me = this;
    console.log('cancelAlarm', params);
    me._dataManager.alarm.cancel(params, cb);
};