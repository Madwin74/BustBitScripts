/* MODULES
-----------------*/


/* TEMP. VARS
-----------------*/


/* INITIALIZATION
-----------------*/

//variables --- DO NOT CHANGE SOMETHING BELOW! -----
var SatoshiMultiplier = 100;
var cooledDown = false;
var baseSatoshi = initialBet * SatoshiMultiplier;
var maxBetSatoshi = maxBet * SatoshiMultiplier;
var currLoss = 0;
var currentGameID = -1;
var playedGames = 0;
var profit = 0;
var initialBalance = engine.getBalance();
var currentBet = 0;
var startTime = new Date().getTime();
var timeRunning = 0;
var currentTime;
var highestBalance = 0;

//Initialization

console.log('[Bot] ====== Merowinger\'s BustaBit Script ======[Bot]');
console.log('[Bot] My username is: ' + engine.getUsername());
console.log('[Bot] My starting balance: ' + (engine.getBalance() / SatoshiMultiplier).toFixed(2) + ' bits');

currentBet = baseSatoshi;
highestBalance = engine.getBalance();


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
    
    //register functions on Events game_starting & player_cashed_out
    
    
    });
    
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
