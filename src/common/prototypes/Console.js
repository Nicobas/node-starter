const logger = require('winston');

if (CONFIG.logs.debug) {
    // eslint-disable-next-line no-console
    console.log = logger.debug;
}
