'use strict';


//#
const _            =  require('lodash');
const SocketIO     =  require('socket.io-client');

//#

var EventEmitter =  require('events').EventEmitter,
    inherits     =  require('util').inherits,
    co           =  require('co'),
    request      =  require('co-request');

module.exports = GameClient;

function GameClient(config) {
    EventEmitter.call(this);

    this.config = config;

    this.socket = require('socket.io-client')(config.GAMESERVER);
    this.socket.on('error', this.onError.bind(this));
    this.socket.on('err', this.onErr.bind(this));
    this.socket.on('connect', this.onConnect.bind(this));
    this.socket.on('disconnect', this.onDisconnect.bind(this));
    this.socket.on('game_crash', this.onGameCrash.bind(this));
    //this.socket.on('join', this.onJoin.bind(this));

    //add game_starting, cashed_out
    this.socket.on('game_starting', this.onGameStarting.bind(this));
    this.socket.on('cashed_out', this.onCashedOut.bind(this));
}

inherits(GameClient, EventEmitter);

GameClient.prototype.onError = function(err) {
    console.error('onError: ', err);
};

GameClient.prototype.onErr = function(err) {
    console.error('onErr: ', err);
};

GameClient.prototype.onConnect = function(data) {
    console.log("Connected to GameServer");

    var self = this,
        ott = getOtt(self.config);

    var info = ott ? { ott: "" + ott } : {};
    self.socket.emit('join', info, function(err, data) {
        if (err)
            console.error('[ERROR] onConnect:', err);
        else
            self.onJoin(data);
    });
};

GameClient.prototype.onDisconnect = function(data) {
    console.log('Disconnected from Game server |', data, '|', typeof data);
    this.emit('disconnect');
};

GameClient.prototype.onJoin = function(data) {
  let created = data.created = new Date(data.created).getTime();
  _.forEach(data.table_history, function(game) {
    game.created = new Date(game.created).getTime();
    game.startTime = game.created + 5000; // TODO: move this constant
  });
  // TODO: is this also valid for ENDED?
  let startTime = Date.now() - data.elapsed;

  let copy =
    { state:        data.state,
      game_id:      data.game_id,
      created:      created,
      last_hash:    data.last_hash,
      elapsed:      data.elapsed,
      username:     data.username,
      balance:      data.balance_satoshis
    };

  debug('Resetting client state\n%s', JSON.stringify(copy, null, ' '));

  this.lastServerSeed = data.last_hash;
  this.game =
    { id:              data.game_id,
      serverSeedHash:  data.last_hash,
      created:         created,
      startTime:       startTime,
      players:         data.player_info,
      state:           data.state,
      // Valid after crashed
      crashpoint:      null,
      serverSeed:      null,
      forced:          null
    };

  for (let i = 0; i < data.joined.length; ++i)
    this.game.players[data.joined[i]] = {};

  let players = data.player_info;

  this.balance  = data.balance_satoshis;
  this.username = data.username;

  // Retrieve user state from player info
  if (!players[this.username])
    this.userState = 'WATCHING';
  else if (players[this.username].stopped_at)
    this.userState = 'CASHEDOUT';
  else if(data.state === 'ENDED')
    this.userState = 'CRASHED';
  else
    this.userState = 'PLAYING';

  this.emit('join', data);
};

GameClient.prototype.onGameCrash = function(data) {
    this.emit('game_crash', data);
};

GameClient.prototype.onGameStarting = function(data) {
  /* Example:
       { "game_id":1000020,
         "max_win":150000000,
         "time_till_start":5000
       }
  */
  console.log('game starting...');
  this.emit('game_starting', data);
};

GameClient.prototype.onCashedOut = function(data) {
  /* Example:
       { "username":"Steve",
         "stopped_at":2097
       }
  */
  var self = this;

  if (self.config.USER === data.username) {
    this.emit('cashed_out', data);
    this.emit('user_cashed_out', data);
  } else {
    this.emit('cashed_out', data);
  }
};



// Get a one time token from the server to join the game.
function getOtt(config) {
    if (!config.SESSION) return null;

    var cookie = request.cookie('id=' + config.SESSION),
        url    = config.WEBSERVER + '/ott',
        jar    = request.jar();

    jar.setCookie(cookie, url);

    var res = request.post({url:url, jar:jar});
    return res.body;
}
