'use strict';

const _ = require('lodash');
const Joi = require('joi');
const Boom = require('boom');

const register = function (server, options, next) {

    let trackService = _.get(options, 'trackService');

    // var points = [
    //     {
    //         "id": "3a4cca90-89fd-471f-8286-55e98f8216a8",
    //         "trackId": "355beffb-fcc9-4820-b598-0f16a21df96c",
    //         "capturedAt": "1502205754858",
    //         "latitude": "12.34",
    //         "longitude": "56.78",
    //         "altitude": "90.12",
    //         "horizontalAccuracy": "12.34",
    //         "verticalAccuracy": "56.78",
    //         "course": "90.12",
    //         "speed": "34.78"
    //     },
    //     {
    //         "id": "854b59fa-31dd-4d3b-9f7c-f385d6d7a2a7",
    //         "trackId": "355beffb-fcc9-4820-b598-0f16a21df96c",
    //         "capturedAt": "1502205882355",
    //         "latitude": "112.34",
    //         "longitude": "156.78",
    //         "altitude": "190.12",
    //         "horizontalAccuracy": "112.34",
    //         "verticalAccuracy": "156.78",
    //         "course": "190.12",
    //         "speed": "134.78"
    //     }
    // ];

    server.route({
        method: 'POST',
        path: '/register-points',
        config: {
            validate: {
                payload: Joi.array().items(
                    Joi.object().keys({
                        id: Joi.string().uuid().required(),
                        trackId: Joi.string().uuid().required(),
                        capturedAt: Joi.number(),
                        latitude: Joi.number(),
                        longitude: Joi.number(),
                        altitude: Joi.number(),
                        horizontalAccuracy: Joi.number(),
                        verticalAccuracy: Joi.number(),
                        course: Joi.number(),
                        speed: Joi.number()
                    })
                ).min(1).required()
            },
            handler: function (request, reply) {
                let params = {};
                params.trackingPointsData = request.payload;
                trackService.registerPoints(params, function (err, result) {
                    if (err) {
                        return reply({ success: false, error: err.message });
                    }
                    return reply({success: true, result: result});
                });
            }
        }
    });

    return next();
};

register.attributes = {
    name: 'track',
    version: '1.0.0'
};

module.exports = register;
