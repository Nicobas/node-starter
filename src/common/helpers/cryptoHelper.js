const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    return bcrypt.hash(password, 10);
};

const comparePassword = async (password, password_hash) => {
    if (!password_hash) {
        return false;
    }

    return bcrypt.compare(password, password_hash);
};

module.exports = {
    hashPassword,
    comparePassword,
};
