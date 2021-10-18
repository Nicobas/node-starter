const server_conf_path = './server.js';
const common_conf_path = './common.js';

module.exports = {
    server: require(server_conf_path),
    common: require(common_conf_path),
};
