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
    	
    	//stop betting when reached target profti
    	if (profit > gameConfig.PROFIT)
    	{
    		console.log("Taget Profit reached: " + profit);
    		return;	
    	};
    	
    	//we enough funds to do anything ( bits > 1?)
    	if (currentBalance < SatoshiMultiplier){
		console.log(" Insufficent funds to do anything...");
		return;
	};
	
	////increase Loss Streak if enabled
	if(gameConfig.LOSSSTREAKPROTECTION){
		if(lostLast && played){
			currLoss++;
		};
	//is Bot currently cooled down due to a loss streak?	
		if (currLoss >= gameConfig.LOSSSTREAK){
			cooledDown = true;
			console.log('[Bot] We are on a Loss Streak... Cooling down..');
		}
		if (cooledDown){
			if (currLoss == 0) {
				cooledDown = false;
			}else {
				currLoss--;
				console.log('[Bot] Secured your stake for another ' + currLoss + ' games');
				return;
			};			
		};
	};
	
	//calculate the new bet
	if ( !(lostLast) && playedGames > 0 && played )
	{
		currLoss = 0;
		//either multiply or add the basebet
		if (gameConfig.MULTIPLY){
			currentBet *= gameConfig.MULITIPLIER;
		} else{
			currentBet += baseSatoshi;
		};
		if (highestBalance <= currentBalance )
		{
			//use base bet according to OScars Grind systemLanguage
			currentBet = baseSatoshi;
			highestBalance = currentBalance;
		};
	};
	
	//check if maxumum betting amount is reached 
	if (currentBet > gameConfig.MAX) {
		console.log('[Bot] Max amount bet bits reached...');
		if (gameConfig.STOP){
			console.log('[Bot] stopping Bot');
			return;
		};
		if (gameConfig.RESET)
		{
			currentBet = baseSatoshi;
		} else {
			currentBet = maxBetSatoshi;
		};
	};
	
	//check if currentBet is affordable
    	if (currentBet > currentBalance )
	{
		console.log('[Bot] Cannot afford ' + currentBet / SatoshiMultiplier + ' bits...');
		if (gameConfig.LOW){
			console.log('[Bot] Stop betting due to low balance');
			return;				
		}
			
		if ( baseSatoshi > currentBalance ) {
			console.error('[Bot] Insufficent funds for intial bet... stopping');
			return;
		};
		
		currentBet = baseSatoshi;				
	};
    	
    	//Place our bet
        var CurrMulti = Math.round(gameConfig.TARGET * betMultiplier);
        this.socket.emit('place_bet', currentBet, CurrMulti , function(err) {
            if (err) {
            	console.error('Place bet error:', err)
            } else {
            	console.log("Placed " + Math.round(currentBet/SatoshiMultiplier) +" bits on Multiplier: " + gameConfig.TARGET);
            	currentBalance = currentBalance - currentBet;
            	playedGames++;
            	//set some variables for later processing
            	played = true;
            	lostLast = false;
            } ;
        }); 
    });
    
    //register function on Event game_crashed
    self.gameClient.on('game_crash', function(data){
        //console.log(JSON.stringify(data));
        //console.log(data.game_crash);
        if (playedGames > 0 && played)
		{
		    var bonus = (data.bonuses[config.USER] / SatoshiMultiplier).toFixed(2);
		    //not sure if correct place for played variable...
		    played = false;
		    if (data.game_crash < Math.round(gameConfig.TARGET * betMultiplier))
		    {
		    	currentBalance = currentBalance + bonus;
		    	console.log("Game crashed at " + (data.game_crash/SatoshiMultiplier).toFixed(2) + " LOST");
		    	lostLast = true;
		    } else {
		    	currentBalance = currentBalance + Math.round(currentBet*gameConfig.TARGET) + bonus;// TODO: BONUS    + Bonus;
		    	console.log("Game crashed at " + (data.game_crash/SatoshiMultiplier).toFixed(2) + " WIN");	
		    };
		    profit = ((currentBalance - initialBalance)/SatoshiMultiplier).toFixed(2);
		    console.log("Session Profit in bits: " + profit);
		    console.log("New Balance: " + (currentBalance/SatoshiMultiplier).toFixed(2));
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
