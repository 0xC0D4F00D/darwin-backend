const _ = require('lodash');
const async = require('async');

function UserService(config) {
    var me = this;
    me._config = _.get(config, 'config');
    me._dataManager = _.get(config, 'dataManager');
}

module.exports = UserService;

UserService.prototype.updatePushToken = function (params, cb) {
    var me = this;
    console.log('updatePushToken', params);
    me._dataManager.user.updatePushToken(params, cb);
};

UserService.prototype.updateLocation = function (params, cb) {
    var me = this;
    console.log('updateLocation', params);
    me._dataManager.user.updateLocation(params, cb);
};

UserService.prototype.getView = function (params, cb) {
    var me = this;
    me._dataManager.user.getView(params, cb);
};

// UserService.prototype.logUserIn = function (params, cb) {
//     var me = this;

//     var state = {};

//     function checkForSuperuser (cb) {
//         var superUserLogin = _.get(me._config, 'app.superuser.login');
//         if (_.isEmpty(superUserLogin) || !_.isEqual(params.login, superUserLogin)) return cb();
//         var superUserPassword = _.get(me._config, 'app.superuser.password');
//         bcrypt.compare(params.password, superUserPassword, function(err, matched) {
//             if (matched === true) state.user = 'superuser';
//             return cb();
//         });
//     }

//     function checkForOthers (cb) {
//         // Пропускаем эту процедуру, если пользователь уже установлен
//         if (!_.isEmpty(state.user)) return cb();

//         // Запрашиваем информацию о пользователе,
//         // необходимую для аутентификации и авторизации
//         let params2 = _.pick(params, 'login');
//         me._dataManager.user.getUserAuthInfo(params2, function (err, result) {
//             if (err) return cb(err);

//             // Если не найдена информация по данному логину,
//             // прерываем выполнение процедуры
//             if (_.isEmpty(result)) return cb();

//             // Проверяем пароль, предоставленный пользователем с помощью
//             // хеша настоящего пароля, хранящегося в базе данных
//             bcrypt.compare(params.password, result.password, function(err, matched) {
//                 if (matched === true) {
//                     state.user = _.pick(result, [ 'id' ]);
//                 }
//                 return cb();
//             });
//         });
//     }

//     function createSession (cb) {
//         // Если нет информации на пользователя то прерываем процедуру
//         if (_.isEmpty(state.user)) return cb();

//         // Формируем параметры для создания сессии
//         let params2 = {};
//         if (_.isEqual(state.user, 'superuser')) {
//             params2['user_id'] = null;
//             params2['created_by_super_user'] = true;
//         } else {
//             params2['user_id'] = _.get(state.user, 'id');
//             params2['created_by_super_user'] = false;
//         }

//         me._dataManager.session.createSession(params2, function (err, result) {
//             if (err) return cb(err);
//             state.sessionId = _.get(result, 'id');
//             return cb();
//         });
//     }

//     function getSessionInfo (cb) {
//         // Если нет идентификатора сессии, пропускаем процедуру
//         if (_.isEmpty(state.sessionId)) return cb();
//         var params2 = { id: state.sessionId };
//         me.getSessionInfo(params2, function (err, result) {
//             if (err) return cb(err);
//             state.sessionInfo = result;
//             return cb();
//         });
//     }

//     function createToken (cb) {
//         // Если нет информации о сессии, пропускаем процедуру
//         if (_.isEmpty(state.sessionInfo)) return cb();

//         var jwtSecret = _.get(me._config, 'app.jwt_secret');
        
//         var payload = {};
//         payload['session_id'] = _.get(state.sessionInfo, 'id');

//         var expiresIn = _.get(state.sessionInfo, 'expiring_in');

//         state.token = jwt.sign(payload, jwtSecret, { algorithm: 'HS256', expiresIn: expiresIn + 's' });
//         return cb();
//     }

//     async.series([
//         checkForSuperuser,
//         checkForOthers,
//         createSession,
//         getSessionInfo,
//         createToken
//     ], function (err) {
//         if (err) return cb(err);
//         var result = _.pick(state, [ 'sessionInfo', 'token' ]);
//         return cb(null, result);
//     });
// };

// UserService.prototype.logUserOut = function (params, cb) {
//     var me = this;
//     me._dataManager.session.closeSession(params, function (err, result) {
//         if (err) return cb(err);
//         var result2 = {};
//         result2['session_id'] = _.get(result, 'id');
//         return cb(null, result2);
//     });
// };

// UserService.prototype._getSessionInfo = function (params, cb) {
//     var me = this;

//     me._dataManager.session.getSession(params, function (err, result) {
//       if (err) return cb(err);

//       // var credentials = _.clone(result);
//       // if (credentials) credentials.scope = [ 'admin' ];

//       // console.log('CRED', credentials);

//       var credentials = _.clone(result);
//       return cb(null, credentials);
//     });    
// }

// UserService.prototype.getSessionInfo = function (params, cb) {
//     var me = this;
//     me._getSessionInfo(params, cb);
// }

// UserService.prototype.extendSession = function (params, cb) {
//     var me = this;

//     var state = {};

//     function updateSession (cb) {
//         // Формируем параметры для создания сессии
//         let params2 = _.pick(params, 'session_id');
//         me._dataManager.session.extendSession(params2, function (err, result) {
//             if (err) return cb(err);
//             state.sessionId = _.get(result, 'id');
//             return cb();
//         });
//     }

//     function getSessionInfo (cb) {
//         // Если нет идентификатора сессии, пропускаем процедуру
//         if (_.isEmpty(state.sessionId)) return cb();
//         var params2 = { id: state.sessionId };
//         me.getSessionInfo(params2, function (err, result) {
//             if (err) return cb(err);
//             state.sessionInfo = result;
//             return cb();
//         });
//     }

//     function createToken (cb) {
//         // Если нет информации о сессии, пропускаем процедуру
//         if (_.isEmpty(state.sessionInfo)) return cb();
//         var jwtSecret = _.get(me._config, 'app.jwt_secret');
//         //var payload = _.clone(state.sessionInfo);
//         //payload = _.unset(payload, 'expiring_in');

//         var payload = {};
//         payload['session_id'] = _.get(state.sessionInfo, 'id');

//         var expiresIn = _.get(state.sessionInfo, 'expiring_in');

//         state.token = jwt.sign(payload, jwtSecret, { algorithm: 'HS256', expiresIn: expiresIn + 's' });
//         return cb();
//     }

//     async.series([
//         updateSession,
//         getSessionInfo,
//         createToken
//     ], function (err) {
//         if (err) return cb(err);
//         var result = _.pick(state, [ 'sessionInfo', 'token' ]);
//         return cb(null, result);
//     });
// }

// UserService.prototype.listUsers = function (params, cb) {
//     var me = this;
//     me._dataManager.user.listUsers(params, cb);
// };

// UserService.prototype.createUser = function (params, cb) {
//     var me = this;

//     // If we got temporary ID then remove it so system will create new record
//     var id = _.get(params, 'id');
//     if (_.startsWith(id, 'TMP_')) {
//         _.unset(params, 'id');
//     }

//     var password = _.get(params, 'password');
//     if (password === '') {
//         _.unset(params, 'password');
//     }

//     me._dataManager.user.createUser(params, function (err, result) {
//         if (err) return cb(err);
//         _.unset(result, 'password');
//         return cb(null, result);
//     });
// };

// UserService.prototype.readUser = function (params, cb) {
//     var me = this;
//     me._dataManager.user.readUser(params, cb);
// };

// UserService.prototype.updateUser = function (params, cb) {
//     var me = this;

//     me._dataManager.user.updateUser(params, function (err, result) {
//         if (err) return cb(err);
//         _.unset(result, 'password');
//         return cb(null, result);
//     });
// };

// UserService.prototype.deleteUsers = function (params, cb) {
//     var me = this;
//     me._dataManager.user.deleteUsers(params, cb);
// };

// UserService.prototype.getDesktopToken = function (params, cb) {
//     let me = this;
//     me._dataManager.user.getPasswordForDesktop(params, function (err, data) {
//         if (err) return cb(err);
//         if (_.isEmpty(data)) return cb();

//         var sessionId = _.get(params, 'session_id');
//         var sessionIdEncoded = _.toUpper(_.replace(sessionId, /-/g, ''));

//         var password = _.get(data, 'password');
//         var passwordChunks = password.match(/.{1,32}/g);

//         var prefix = '= EPELAN-2-DESKTOP-TOKEN-BEGIN =';
//         var suffix = '== EPELAN-2-DESKTOP-TOKEN-END ==';

//         var lines = _.concat(prefix, sessionIdEncoded, passwordChunks, suffix);
//         var token = _.join(lines, '\n');

//         var result = {};
//         result.token = token;

//         console.log(result.token);

//         return cb(null, result);
//     });
// };