
var ScriptServer = require('scriptserver');

module.exports = function(self) {
    
    self.events = {};
    
    self.parseLoop.parseConsole = {
        id: 'parseConsole',
        condition: function() { return self.events.console; },
        method: function(line) {
            if (self.events.console) self.events.console(line);
        }
    };
    
    self.parseLoop.parseChat = {
        id: 'parseChat',
        condition: function() { return self.events.chat; },
        regexp: /<([\S]+)>\s(.*)/,
        method: function(stripped) {
            if (stripped && self.events.chat) self.events.chat({
                sender: stripped[1],
                message: stripped[2],
                timestamp: Date.now()
            });
        }
    };
    
    self.parseLoop.parseLogin = {
        id: 'parseLogin',
        condition: function() { return self.events.login; },
        regexp: /\]:\s(\S+)\[\/((?:[0-9]{1,3}\.){3}[0-9]{1,3}).*at\s\((-?[\d]+\.[\d]+), (-?[\d]+\.[\d]+), (-?[\d]+\.[\d]+)/,
        method: function(stripped) {
            if (stripped && self.events.login) self.events.login({
                player: stripped[1],
                ip: stripped[2],
                x: stripped[3],
                y: stripped[4],
                z: stripped[5],
                timestamp: Date.now()
            });
        }
    };
    
    self.parseLoop.parseLogout = {
        id: 'parseLogout',
        condition: function() { return self.events.logout; },
        regexp: /\]:\s(\S+).*text='(.*)',\ssiblings/,
        method: function(stripped) {
            if (stripped && self.events.logout) self.events.logout({
                player: stripped[1],
                reason: stripped[2],
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
