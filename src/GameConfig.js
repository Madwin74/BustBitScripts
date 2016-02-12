module.exports = {
    TARGET: 1.25, //Target Multiplier when to cash out
    BET: 1, //first BET
    MAX: 10000000000000, //maximum bet that the bot will bet
    RESET: false, //true: if max bet is reached bet will be reset to initial bet, false: continue with maxBet 
    STOP: false, //true: stop if maxBet is reached, false: continue with processing
    LOW: false, //true: stop if balance is not enough for currentBet, false: continue with intial bet if possible
    PROFIT: 1000, //Target Profit in bits; don't be too greedy
    LOSSSTREAKPROTECTION: true, // enable LossStreak Protection
    LOSSSTREAK: 2, //if Loss Streak Protection is enabled; maximum lose streak before pausing the bot for x games
    MULTIPLY: false, // if set to true each winning stake is multiplied by betMultiplier
    MULITIPLIER: 2, //only used when multilyBet is true
    ENABLEBANK: false, //enable for save x amount of profit to another account
    BANK: 100 //amount when to save profit
};
