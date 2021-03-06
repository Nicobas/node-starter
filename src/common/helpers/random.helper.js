/* eslint-disable no-unused-vars */
const randomToken = require('rand-token');

const BASE10 = '0123456789';
const BASE16 = '0123456789abcdef';
const BASE26 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZZ';
const BASE33 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const BASE36 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const BASE66 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-._~';
const BASE71 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!'()*-._~";

const DEFAULT_TOKEN_SIZE = 20;

const generateToken = (size = DEFAULT_TOKEN_SIZE) => {
    return randomToken.generate(size, BASE62);
};

module.exports = {
    generateToken,
};
