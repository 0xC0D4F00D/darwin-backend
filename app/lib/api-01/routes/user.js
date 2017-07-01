'use strict';

const _ = require('lodash');
var Joi = require('joi');
var Boom = require('boom');

const register = function (server, options, next) {

    var userService = _.get(options, 'userService');

    server.route({
        method: 'POST',
        path: '/update-push-token',
        config: {
            validate: {
                payload: {
                    userId: Joi.string().uuid().required(),
                    token: Joi.string().required(),
                    platform: Joi.string().optional()
                }
            },
            handler: function (request, reply) {
                var params = _.pick(request.payload, ['userId', 'token', 'platform']);
                userService.updatePushToken(params, function (err, result) {
                    if (_.isEmpty(result)) {
                        return reply({ success: false });
                    }
                    return reply({success: true, result: result});
                });
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/update-location',
        config: {
            validate: {
                payload: {
                    userId: Joi.string().uuid().required(),
                    lat: Joi.number().required(),
                    lon: Joi.number().required(),
                    accuracy: Joi.number().required()
                }
            },
            handler: function (request, reply) {
                var params = _.pick(request.payload, ['userId', 'lat', 'lon', 'accuracy']);
                userService.updateLocation(params, function (err, result) {
                    if (err) {
                        return reply({ success: false, error: err.message });
                    }
                    return reply({ success: true });
                });
            }
        }
    });


    server.route({
        method: 'GET',
        path: '/view',
        config: {
            // auth: {
            //     scope: [ 'admin' ]
            // },
            auth: false,
            handler: function (request, reply) {
                var params = {};
                    userService.getView(params, function (err, result) {
                    if (err) {
                        return reply({ success: false });
                    }
                    return reply({ success: true, result: result });
                });
            }
        }
    });

    // server.route({
    //     method: 'GET',
    //     path: '/logout',
    //     config: {
    //         auth: {mode: 'try'},
    //         handler: function (request, reply) {
    //             var params = {};
    //             params['session_id'] = _.get(request, ['auth', 'credentials', 'id']);
    //             userService.logUserOut(params, function (err, result) {
    //                 if (err) return Boom.wrap(err);
    //                 return reply({result: result});
    //             });
    //         }
    //     }
    // });

    // server.route({
    //     method: 'GET',
    //     path: '/get-session-info',
    //     config: {
    //         auth: {mode: 'try'},
    //         handler: function (request, reply) {

    //             // Debug
    //             // setTimeout(function () {
    //             //     reply(Boom.badImplementation('ERROR!!!'));
    //             // }, 2000);

    //             var sessionInfo = _.get(request, ['auth', 'credentials']);
    //             var result = _.isEmpty(sessionInfo) ? null : {sessionInfo: sessionInfo};
    //             return reply({result: result});
    //         }
    //     }
    // });

    // server.route({
    //     method: 'GET',
    //     path: '/extend-session',
    //     config: {
    //         auth: {mode: 'try'},
    //         handler: function (request, reply) {
    //             var params = {};
    //             params['session_id'] = _.get(request, ['auth', 'credentials', 'id']);
    //             userService.extendSession(params, function (err, result) {
    //                 //if (_.isEmpty(result)) return reply({ success: false });
    //                 return reply({ result: result });
    //             });
    //         }
    //     }
    // });

    // server.route({
    //     method: 'GET',
    //     path: '/list',
    //     config: {
    //         handler: function (request, reply) {
    //             var params = _.pick(request.query, [ 'start', 'limit' ]);
    //             userService.listUsers(params, function (err, result) {
    //                 if (err) { return reply(err); }
    //                 return reply({ success: true, result: result });
    //             });
    //         },
    //         validate: {
    //             query: {
    //                 page: Joi.any().optional(),
    //                 start: Joi.number().integer(),
    //                 limit: Joi.number().integer().min(1).max(100).default(10),
    //                 _dc: Joi.any().optional()
    //             }
    //         }
    //     }
    // });

    // server.route({
    //     method: 'POST',
    //     path: '/create',
    //     config: {
    //         handler: function (request, reply) {
    //             var params = _.isObject(request.payload) ? request.payload : {};
    //             userService.createUser(params, function (err, result) {
    //                 if (err) return reply(err);
    //                 return reply({ success: true, result: result });
    //             });
    //         },
    //         validate: {
    //             payload: {
    //                 id: Joi.alternatives().try(Joi.string().uuid().optional(), Joi.string().regex(/^TMP_.+$/)) ,
    //                 login: Joi.string().optional(),
    //                 password: Joi.string().min(6).optional(),
    //                 full_name: Joi.string().optional(),
    //                 post: Joi.string().allow('').optional(),
    //                 department: Joi.string().allow('').optional(),
    //                 section_code: Joi.string().allow('').optional(),
    //                 email: Joi.string().allow('').optional(),
    //                 phone_number: Joi.string().allow('').optional(),
    //                 is_active: Joi.boolean().optional(),
    //                 roles: Joi.array().items(Joi.string())
    //             }
    //         }
    //     }
    // });

    // server.route({
    //     method: 'GET',
    //     path: '/read',
    //     config: {
    //         handler: function (request, reply) {
    //             var params = _.pick(request.query, [ 'id' ]);
    //             userService.readUser(params, function (err, result) {
    //                 if (err) return reply(err);
    //                 return reply({ success: true, result: result });
    //             });
    //         },
    //         validate: {
    //             query: {
    //                 id: Joi.string().uuid(),
    //                 _dc: Joi.any().optional()
    //             }
    //         }
    //     }
    // });

    // server.route({
    //     method: 'POST',
    //     path: '/update',
    //     config: {
    //         handler: function (request, reply) {
    //             var params = _.isObject(request.payload) ? request.payload : {};
    //             userService.updateUser(params, function (err, result) {
    //                 if (err) return reply(err);
    //                 return reply({ success: true, result: result });
    //             });
    //         },
    //         validate: {
    //             payload: {
    //                 id: Joi.alternatives().try(Joi.string().uuid().optional(), Joi.string().regex(/^TMP_.+$/)) ,
    //                 login: Joi.string().optional(),
    //                 password: Joi.string().min(6).optional(),
    //                 full_name: Joi.string().optional(),
    //                 post: Joi.string().allow('').optional(),
    //                 department: Joi.string().allow('').optional(),
    //                 section_code: Joi.string().allow('').optional(),
    //                 email: Joi.string().allow('').optional(),
    //                 phone_number: Joi.string().allow('').optional(),
    //                 is_active: Joi.boolean().optional(),
    //                 roles: Joi.array().items(Joi.string())
    //             }
    //         }
    //     }
    // });

    // server.route({
    //     method: 'POST',
    //     path: '/delete',
    //     config: {
    //         handler: function (request, reply) {
    //             var uuidList = _.isArray(request.payload) ? request.payload : [];
    //             var params = { uuidList: uuidList };
    //             userService.deleteUsers(params, function (err, result) {
    //                 if (err) return reply(err);
    //                 return reply({ success: true, result: result });
    //             });
    //         },
    //         validate: {
    //             payload: Joi.array().items(Joi.string().uuid())
    //         }
    //     }
    // });

    // server.route({
    //     method: 'GET',
    //     path: '/get-desktop-token',
    //     config: {
    //         handler: function (request, reply) {
    //             var params = {};
    //             params['session_id'] = _.get(request, ['auth', 'credentials', 'id']);
    //             userService.getDesktopToken(params, function (err, result) {
    //                 if (err) return reply(err);
    //                 return reply({ success: true, result: result });
    //             });
    //         }
    //     }
    // });

    return next();
};

register.attributes = {
    name: 'user',
    version: '1.0.0'
};

module.exports = register;
