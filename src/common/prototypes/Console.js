const logger = require('winston');

const CONFIG = require('../../../config/config');

if (CONFIG.common.logs.debug) {
    console.log = logger.debug;
}
