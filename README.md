Deprecated - Moved to @scriptserver/event
====================

[![](http://i.imgur.com/zhptNme.png)](https://github.com/garrettjoecox/scriptserver)

FYI: This package is an addon for ScriptServer and requires ScriptServer to be set up, please see [here](https://github.com/garrettjoecox/scriptserver) for more information.

## Installation
While in root directory of your server run:
```
npm install scriptserver-event
```
And in your `server` file:
```javascript
server.use(require('scriptserver-event'));
```

## Usage
This module provides the following interface for hooking in to server events.

#### Chat Event
Fires when a player sends a message in chat
```javascript
// Registers the event 'chat' to the following function
server.on('chat', event => {

  // Player who sent the chat message
  console.log(event.player);

  // The chat message itself
  console.log(event.message);

});
```

#### Login Event
Fires when a player logs in
```javascript
// Registers the event 'login' to the following function
server.on('login', event => {

  // Player who logged in
  console.log(event.player);

  // IP Address the user logged in with
  console.log(event.ip);

});
```

#### Logout Event
Fires when a player logs out
```javascript
// Registers the event 'logout' to the following function
server.on('logout', event => {

  // Player who logged out
  console.log(event.player);

});
```

#### Achievement Event
Fires when a player receives an Achievement
```javascript
// Registers the event 'achievement' to the following function
server.on('achievement', event => {

  // Player who received the achievement
  console.log(event.player);

  // The achievement the player received
  console.log(event.achievement);

});
```

#### Server Start Event
Fires when server finishes starting
```javascript
// Registers the event 'start' to the following function
server.on('start', event => {

  // Timestamp of when server finished loading
  console.log('Server Started!');
});
```

#### Server Stop Event
Fires when server closes
```javascript
// Registers the event 'exit' to the following function
server.on('stop', event => {

  // Timestamp of when server closed
  console.log('Server Closed!');
});
```

## Edit match of a event
Open the index.js for more info at the variable "custom_matchs".

Example:
```js

// My Custom Event for a Spigot Chat Server
const server = new ScriptServer({
  eventHooks: {
    chat: (string) => {
      const parsed = string.match(/^\[[\d:]{8}\] \[Async Chat Thread - #0\/INFO\]: <(\w+)> (.*)/i);
      if (parsed) {
        return {
          player: parsed[1],
          message: parsed[2],
        };
      }
    }
  }
});

```
