'use strict';

const crypto = require('crypto');

const CONFIG = require('../config');

const algorithm = 'aes-256-ctr';
const password = CONFIG.cryptoSecretKey;

const cryptographyFunctions = {
    encrypt: function (text) {
        var cipher = crypto.createCipher(algorithm, password);
        var crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    },
    decrypt: function (text) {
        var decipher = crypto.createDecipher(algorithm, password);
        var dec = decipher.update(text, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    }
};

module.exports = cryptographyFunctions;