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
var baseSatoshi = gameConfig.BET * SatoshiMultiplier;
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
var played = false;
var lostLast = false;

currentBet = baseSatoshi;

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
        initialBalance = data.balance_satoshis;
        highestBalance = initialBalance;
        currentBalance = initialBalance;
        console.log("Initial Balance: " + (initialBalance / SatoshiMultiplier).toFixed(2));
    });
    
    
    
    //register functions on Events game_starting
    self.gameClient.on('game_starting', function(data) {
        var CurrMulti = Math.round(gameConfig.TARGET * betMultiplier);
        this.socket.emit('place_bet', currentBet, CurrMulti , function(err) {
            if (err) {
            	console.error('Place bet error:', err)
            } else {
            	console.log("Placed " + Math.round(currentBet/SatoshiMultiplier) +" bits on Multiplier: " + gameConfig.TARGET);
            	currentBalance = currentBalance - currentBet;
            	playedGames++;
            	played = true;
            } ;
        }); 
    });
    
    //register function on Event game_crashed
    self.gameClient.on('game_crash', function(data){
        //console.log(JSON.stringify(data));
        //console.log(data.game_crash);
        if (playedGames > 0 && played)
		{
		    played = false;
		    if (data.game_crash < Math.round(gameConfig.TARGET * betMultiplier))
		    {
		    	console.log("Game crashed at " + Math.round(data.game_crash/SatoshiMultiplier) + " LOST");
		    	lostLast = true;
		    } else {
		    	console.log("Game crashed at " + Math.round(data.game_crash/SatoshiMultiplier) + " WIN");	
		    };
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
