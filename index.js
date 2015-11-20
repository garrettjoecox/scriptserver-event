
var ScriptServer = require('scriptserver');

module.exports = function(server) {

    server.events = server.events || {};

    server.parseLoop.parseConsole = {
        id: 'parseConsole',
        condition: function() { return server.events.console; },
        method: function(line) {
            if (server.events.console) server.events.console(line);
        }
    };

    server.parseLoop.parseChat = {
        id: 'parseChat',
        condition: function() { return server.events.chat; },
        regexp: /\]:\s<([\w]+)>\s(.*)/,
        method: function(stripped) {
            if (stripped && server.events.chat) server.events.chat({
                player: stripped[1],
                message: stripped[2],
                timestamp: Date.now()
            });
        }
    };

    server.parseLoop.parseLogin = {
        id: 'parseLogin',
        condition: function() { return server.events.login; },
        regexp: /]:\s([\w]+)\[\/([.\d]+)[^(]+\(([-.\d]+),\s([-.\d]+),\s([-.\d]+)/,
        method: function(stripped) {
            if (stripped && server.events.login) server.events.login({
                player: stripped[1],
                ip: stripped[2],
                x: stripped[3],
                y: stripped[4],
                z: stripped[5],
                timestamp: Date.now()
            });
        }
    };

    server.parseLoop.parseLogout = {
        id: 'parseLogout',
        condition: function() { return server.events.logout; },
        regexp: /]:\s([\w]+)[^{]+{text='([\w ]+)'/,
        method: function(stripped) {
            if (stripped && server.events.logout) server.events.logout({
                player: stripped[1],
                reason: stripped[2],
                timestamp: Date.now()
            });
        }
    };

    server.parseLoop.parseAchievement = {
        id: 'parseAchievement',
        condition: function() { return server.events.achievement; },
        regexp: /]:\s([\w]+)[^[]+\[([\w ]+)\]/,
        method: function(stripped) {
            console.log(stripped);
            if (stripped && server.events.achievement) server.events.achievement({
                player: stripped[1],
                achievement: stripped[2],
                timestamp: Date.now()
            });
        }
    };

};

ScriptServer.prototype.on = function(eventName, callback) {
    var self = this;

    self.events[eventName] = callback;
    return self;
};
