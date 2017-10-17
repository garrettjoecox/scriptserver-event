scriptserver-event
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

  // Timestamp of when the chat was sent
  console.log(event.timestamp);
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

  // Coordinates the player logged in at
  console.log(event.x, event.y, event.z);

  // Timestamp of when the player logged in
  console.log(event.timestamp);
});
```

#### Logout Event
Fires when a player logs out
```javascript
// Registers the event 'logout' to the following function
server.on('logout', event => {

  // Player who logged out
  console.log(event.player);

  // Reason the player disconnected (kick, lost connection, etc)
  console.log(event.reason);

  // Timestamp of when the player logged out
  console.log(event.timestamp);
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

  // Timestamp of when the player received it
  console.log(event.timestamp);
});
```

#### Server Start Event
Fires when server finishes starting
```javascript
// Registers the event 'start' to the following function
server.on('start', event => {

  // Timestamp of when server finished loading
  console.log(event.timestamp);
});
```

#### Server Stop Event
Fires when server closes
```javascript
// Registers the event 'exit' to the following function
server.on('stop', event => {

  // Timestamp of when server closed
  console.log(event.timestamp);
});
```
