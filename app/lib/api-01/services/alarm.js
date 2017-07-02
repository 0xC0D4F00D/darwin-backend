const _ = require('lodash');
const async = require('async');
const https = require('https');
var querystring = require('querystring');

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
        if (err) {
            console.log('err', err);
            return cb(err);
        }
        var users = data;
        console.log('FIGHTERS', users);
        async.eachSeries(users, function (user, cb) {
            let id = _.get(user, 'id');
            let token = _.get(user, 'token');


            if (_.isEmpty(token)) return cb();
            console.log('PUSH TO ', token);


            var key = _.get(me._config, 'app.fcm_api_key');

            // var postData = querystring.stringify({
            //     data: {},
            //     to : token
            // });

            var postData = JSON.stringify({ data: {},  to : token });

            console.log('POST DATA', postData);

            var options = {
                hostname: 'fcm.googleapis.com',
                port: '443',
                path: '/fcm/send',
                method: 'POST',
                keepAlive: true,
                headers: {
                    'Authorization': 'key=' + key,
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            };

            console.log('OPTIONS', options);

            var request = https.request(options, function(response) {
                var chunks = [];

                response.on('data', function (chunk) {
                    chunks.push(chunk);
                });

                response.on('end', function () {
                    var msg;
                    console.log('STATUS', response.statusCode);

                    var body = Buffer.concat(chunks);
                    console.log(body.toString());


                    if (response.statusCode != 200) {
                        msg = 'Unexpected result from FCM. Status: ' + response.statusCode;
                        return cb(new Error(msg));
                    } else {
                        var body = Buffer.concat(chunks);
                        console.log(body.toString());
                        //return cb(null, body);
                        return cb();
                    }
                });
            });

            request.on('error', function(err) {
                var msg = 'Error during requesting Print Server.';
                // return cb(new Error(msg, err))
                return cb();
            });

            request.write(postData);

            request.end();



            //console.log('PUSH NOTIFICATION TO USER WITH ID', id, 'AND TOKEN', token);
            // return cb();
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
            minLon -= 0.002;
            minLat -= 0.002;
            maxLon += 0.002;
            maxLat += 0.002;
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