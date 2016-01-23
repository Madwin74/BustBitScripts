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
var currentBalance = 0;
var betMultiplier = 100;

currentBet = baseSatoshi;

//welcome statement
console.log(baseSatoshi);
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
        initialBalance = data.balance_satoshis;
        highestBalance = initialBalance;
        currentBalance = initialBalance;
        console.log("Initial Balance: " + (initialBalance / SatoshiMultiplier).toFixed(2));
    });
    
    
    //register functions on Events game_starting
    self.gameClient.on('game_starting', function(data) {
        
	console.log("current Bet: " + currentBet);
	console.log("Target Multiplier: " + (gameConfig.TARGET * betMultiplier));
        this.socket.emit('place_bet', currentBet, (gameConfig.TARGET * betMultiplier) , function(err) {
            if (err) {
            	console.error('Place bet error:', err)
            	
            } else { 
            	currentBalance -= currentBet;
            } ;
        }); 
        
        playedGames++;
    });
    
    //register function on Event game_crashed
    self.gameClient.on('game_crash', function(data){
        console.log(JSON.stringify(data));
        if (playedGames > 0)
		{
		    
		}
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
