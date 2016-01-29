var sensitive  = require('../../sensitive_data/BustABit.js');
module.exports = {
    GAMESERVER: "https://gs.bustabit.com",
    WEBSERVER: "https://www.bustabit.com",
    SESSION: sensitive.SESSION ,
    USER: sensitive.USER,
    PASSWORD: sensitive.PASSWORD, //currently not implemented
    BANK: sensitive.BANK //currently not implemented
};
