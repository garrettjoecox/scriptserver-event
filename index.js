
const defaultsDeep = require('lodash.defaultsdeep');
const get = require('lodash.get');
module.exports = function () {
  const server = this;

  if (!server.config.eventHooks) {
    server.config.eventHooks = {};
  }

  if (!server.config.eventHooks.chat) {
    server.config.eventHooks.chat = (string) => {
      const parsed = string.match(/\[Server thread\/INFO\]: <(\w+)> (.*)/i);
      if (parsed) {
        return {
          player: parsed[1],
          message: parsed[2],
        };
      }
    };
  }
  if (!server.config.eventHooks.login) {
    server.config.eventHooks.login = (string) => {
      const parsed = string.match(/\[Server thread\/INFO\]: (\w+)\[\/([\d.:]+)\] logged in/);
      if (parsed) {
        return {
          player: parsed[1],
          ip: parsed[2],
        };
      }
    };
  }
  if (!server.config.eventHooks.logout) {
    server.config.eventHooks.logout = (string) => {
      const parsed = string.match(/\[Server thread\/INFO\]: (\w+) lost connection/);
      if (parsed) {
        return {
          player: parsed[1],
        };
      }
    };
  }
  if (!server.config.eventHooks.achievement) {
    server.config.eventHooks.achievement = (string) => {
      const parsed = string.match(/\[Server thread\/INFO\]: (\w+) has completed the challenge \[([\w\s]+)\]/);
      if (parsed) {
        return {
          player: parsed[1],
          achievement: parsed[2]
        };
      }
    };
  }
  if (!server.config.eventHooks.start) {
    server.config.eventHooks.start = (string) => {
      const parsed = string.match(/\[Server thread\/INFO\]: Done/);
      if (parsed) {
        return {};
      }
    };
  }
  if (!server.config.eventHooks.stop) {
    server.config.eventHooks.stop = (string) => {
      const parsed = string.match(/\[Server thread\/INFO\]: Stopping server/);
      if (parsed) {
        return {};
      }
    };
  }

  server.config.event = defaultsDeep({}, server.config.event, {
    flavorSpecific: {
      default: {
        parseChatEvent(string) {
          return server.config.eventHooks.chat(string);
        },
        parseLoginEvent(string) {
          return server.config.eventHooks.login(string);
        },
        parseLogoutEvent(string) {
          return server.config.eventHooks.logout(string);
        },
        parseAchievementEvent(string) {
          return server.config.eventHooks.achievement(string);
        },
        parseStartEvent(string) {
          return server.config.eventHooks.start(string);
        },
        parseStopEvent(string) {
          return server.config.eventHooks.stop(string);
        },
      },
    },
  });

  const events = [
    ['chat', 'parseChatEvent'],
    ['login', 'parseLoginEvent'],
    ['logout', 'parseLogoutEvent'],
    ['achievement', 'parseAchievementEvent'],
    ['start', 'parseStartEvent'],
    ['stop', 'parseStopEvent'],
  ];

  server.on('console', (string) => {
    const result = events.reduce((acc, event) => {
      if (acc) return acc;

      const parseEvent = get(server.config.event, ['flavorSpecific', server.config.flavor, event[1]], server.config.event.flavorSpecific.default[event[1]]);
      const matches = parseEvent(string);
      if (matches) return { event: event[0], payload: matches };

      return null;
    }, null);

    if (result) {
      result.payload.timestamp = Date.now();
      server.emit(result.event, result.payload);
    }
  });
};
