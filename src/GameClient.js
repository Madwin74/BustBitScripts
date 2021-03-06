'use strict';


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

    var self = this;
    var cookie = request.cookie('id=' + self.config.SESSION),
        url    = self.config.WEBSERVER + '/ott',
        jar    = request.jar();

    jar.setCookie(cookie, url);
    var res = request.post({uri:url, jar:jar}, function(error, response, body){
        //console.log(body);
        var ott = body;
        var info = ott ? { ott: "" + ott } : {};
        //console.log("ott:" + JSON.stringify(ott));
        self.socket.emit('join', info, function(err, data) {
        if (err)
            console.error('[ERROR] onConnect:', err);
        else
            self.onJoin(data);
        });
    });
        
//moves to getOTT method
/*
    var info = ott ? { ott: "" + ott } : {};
    console.log("ott:" + JSON.stringify(ott));
    self.socket.emit('join', info, function(err, data) {
        if (err)
            console.error('[ERROR] onConnect:', err);
        else
            self.onJoin(data);
    });
    */
};

GameClient.prototype.onDisconnect = function(data) {
    console.log('Disconnected from Game server |', data, '|', typeof data);
    this.emit('disconnect');
};

GameClient.prototype.onJoin = function(data) {
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

GameClient.prototype.transfer = function(data){
 var uuid = require('node-uuid');
 var https = require("https"); 
 var self = this;

  // Build the post string from an object
    var post_data = encodeURI("amount="+parseFloat(data.AMOUNT)+
                               "&to-user="+data.ACCOUNT+
                               "&password="+ self.Config.PASSWORD+
                               "&transfer-id="+uuid.v4());
                              // An object of options to indicate where to post to
    var post_options = {  host: 'www.bustabit.com',
                          port: '443',
                          path: '/transfer-request',
                          method: 'POST',
                          headers: {
                                  'Content-Type': 'application/x-www-form-urlencoded',
                                  'Content-Length': post_data.length,
                                  'Access-Control-Allow-Credentials': true,
                                  'Cookie': "id="+self.Config.SESSION
                          }
                         };
    // Set up the request
     var post_req = https.request(post_options, function(res) {
     res.setEncoding('utf8');
     res.on('data', function (chunk) {
                                      //console.log('Response: ' + chunk);
          });
      });
                            
     // post the data
     post_req.write(post_data);
     post_req.end();
};



// Get a one time token from the server to join the game.
//obsolete
/*
GameClient.prototype.getOtt = function(config) {
    if (!config.SESSION) return null;
    
    var self = this;
    
    var cookie = request.cookie('id=' + config.SESSION),
        url    = config.WEBSERVER + '/ott',
        jar    = request.jar();

    jar.setCookie(cookie, url);
    var res = request.post({uri:url, jar:jar}, function(error, response, body){
        console.log(body);
        var ott = body;
        var info = ott ? { ott: "" + ott } : {};
        console.log("ott:" + JSON.stringify(ott));
        self.socket.emit('join', info, function(err, data) {
        if (err)
            console.error('[ERROR] onConnect:', err);
        else
            self.onJoin(data);
    });
        
        
        
    });
    return res.body;
    
};
 */
