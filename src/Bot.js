/* MODULES
-----------------*/


/* SETTINGS
-----------------*/

//Settings
var targetMultiplier = 3.84; //recomended 1.17
var initialBet = 100; //in bits
var maxBet = 100000000; //max Bet in Bits
var resetBet = false; //true: if max bet is reached bet will be reset to initial bet, false: continue with maxBet
var stopMaxBet = false; //true: stop if maxBet is reached, false: continue with processing

var stopLowBalance = true; //true: stop if balance is not enough for currentBet, false: continue with intial bet if possible



var targetProfit = 100; //in bits; don't be too greedy

var enableLossStreakProtection = false; // enable LossStreak Protection
var maxLossStreak = 3; //if Loss Streak Protection is enabled; maximum lose streak before pausing the bot for x games

var multiplyBet = false; // if set to true each winning stake is multiplied by betMultiplier
var betMultiplier = 2; //only used when multilyBet is true


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
