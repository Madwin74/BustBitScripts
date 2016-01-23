/* MODULES
-----------------*/


/* SETTINGS
-----------------*/


/* INITIALIZATION
----------------*/
var gameConfig = require('./GameConfig');

//variables
var SatoshiMultiplier = 100;
var cooledDown = false;
var baseSatoshi = gameConfig.FIRST * SatoshiMultiplier;
var maxBetSatoshi = gameConfig.MAX * SatoshiMultiplier;
var currLoss = 0;
var currentGameID = -1;
var playedGames = 0;
var profit = 0;
var initialBalance = 0;
var currentBet = 0;
var startTime = new Date().getTime();
var timeRunning = 0;
var currentTime;
var highestBalance = 0;

currentbet = baseSatoshi;

//welcome statement
console.log('[Bot] ====== Merowinger\'s BustaBit Script ======[Bot]');


/* BOT
-----------------*/
function MeroBot(){
    var self = this
    self.Config = require('./Config');
    //console.log(JSON.stringify(self.Config)); // uncomment to see your configs
    var GameClient = require('./GameClient'),
        WebClient = require('./WebClient');
    
    // Set bot's session cookie for connections
    require('socket.io-client-cookie').setCookies('id=' + self.Config.SESSION);
    
    // Connect to the game server.
    self.gameClient = new GameClient(self.Config);
    
    // Connect to the web server.
    self.webClient = new WebClient(self.Config);
    
    //get initial Balance
    self.gameClient.on('join', function(data) {
        console.log("joined");
        initialBalance = data.balance_satoshis;
        highestBalance = initialBalance;
        console.log(initialBalance);
    });
    
    
    //register functions on Events game_starting & player_cashed_out
    self.gameClient.on('game_starting', function(data) {
        
            console.log("betting");
          this.socket.emit('place_bet', 100, 1.13, function(err) {
         if (err) console.error('Place bet error:', err);
          });
    })
    
    
}


module.exports.merobot = new MeroBot();


/*EVENTS 
-------------------*/

//gamestarting logic


//player_cashed_out logic




/* UNCAUGHT EXCEPTIONS
-----------------*/
process.on('uncaughtException', function(err) {
    console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
    console.error(err.stack);
    process.exit(1);
});
