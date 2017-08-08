function DataManager(options) {
    var me = this;
    me.user = new (require('./user'))(options);
    me.alarm = new (require('./alarm'))(options);
    me.track = new (require('./track'))(options);
}

module.exports = DataManager;