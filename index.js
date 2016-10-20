'use strict';

module.exports = function() {
  const server = this;

  server.on('console', event => {
    const stripped = event.match(/\]:\s<([\w]+)>\s(.*)/);
    if (stripped) server.emit('chat', {
      player: stripped[1],
      message: stripped[2],
      timestamp: Date.now()
    })
  });

  server.on('console', event => {
    const stripped = event.match(/]:\s([\w]+)\[\/([.\d]+)[^(]+\(([-.\d]+),\s([-.\d]+),\s([-.\d]+)/);
    if (stripped) server.emit('login', {
      player: stripped[1],
      ip: stripped[2],
      x: stripped[3],
      y: stripped[4],
      z: stripped[5],
      timestamp: Date.now()
    })
  });

  server.on('console', event => {
    const stripped = event.match(/]:\s([\w]+)[^{]+{text='([\w ]+)'/);
    if (stripped) server.emit('logout', {
      player: stripped[1],
      reason: stripped[2],
      timestamp: Date.now()
    })
  });

  server.on('console', event => {
    const stripped = event.match(/]:\s([\w]+)[^[]+\[([\w ]+)\]/);
    if (stripped) server.emit('achievement', {
      player: stripped[1],
      achievement: stripped[2],
      timestamp: Date.now()
    })
  });

  const load_listener = (log) => {
    const result = log.match(/]:\sDone/);
    // server launch done
    if(result) {
      // send load event
      server.emit('load');
      // end listen
      server.removeListener('console', load_listener);
    }
  }
  server.on('console', load_listener);

}
