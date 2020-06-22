
const defaultsDeep = require('lodash.defaultsdeep');
const get = require('lodash.get');

module.exports = function () {
  const server = this;

  server.config.event = defaultsDeep({}, server.config.event, {
    flavorSpecific: {
      default: {
        parseChatEvent(string) {
          const parsed = string.match(/^\[[\d:]{8}\] \[Server thread\/INFO\]: <(\w+)> (.*)/i);
          if (parsed) {
            return {
              player: parsed[1],
              message: parsed[2],
            };
          }
        },
        parseLoginEvent(string) {
          const parsed = string.match(/^\[[\d:]{8}\] \[Server thread\/INFO\]: (\w+)\[\/([\d.:]+)\] logged in/);
          if (parsed) {
            return {
              player: parsed[1],
              ip: parsed[2],
            };
          }
        },
        parseLogoutEvent(string) {
          const parsed = string.match(/^\[[\d:]{8}\] \[Server thread\/INFO\]: (\w+) lost connection/);
          if (parsed) {
            return {
              player: parsed[1],
            };
          }
        },
        parseAchievementEvent(string) {
          const parsed = string.match(/^\[[\d:]{8}\] \[Server thread\/INFO\]: (\w+) has completed the challenge \[([\w\s]+)\]/);
          if (parsed) {
            return {
              player: parsed[1],
            };
          }
        },
        parseStartEvent(string) {
          const parsed = string.match(/^\[[\d:]{8}\] \[Server thread\/INFO\]: Done/);
          if (parsed) {
            return {};
          }
        },
        parseStopEvent(string) {
          const parsed = string.match(/^\[[\d:]{8}\] \[Server thread\/INFO\]: Stopping server/);
          if (parsed) {
            return {};
          }
        },
        parseTriggerEvent(string) {
          const parsed = string.match(/^\[[\d:]{8}\] \[Server thread\/INFO\]: \[(\w+): Triggered \[(.*(?=\](?:\]| )))(?:\] \((set|added))?(?:[^0-9]*(\d+(?=\)\])|\d+(?= to value\)\])))?/);
          if (parsed) {
            return {
              player: parsed[1],
              trigger: parsed[2],
              operation: parsed[3],
              value: parsed[4]
            };
          }
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
    ['trigger','parseTriggerEvent']
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
