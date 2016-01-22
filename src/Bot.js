/* MODULES
-----------------*/


/* SETTINGS
-----------------*/


/* INITIALIZATION
----------------*/
var gameConfig = require('./GameConfig');

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
    
    //register functions on Events game_starting & player_cashed_out
    
}

console.log("start");



module.exports.merobot = new MeroBot();

console.log("end");

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
