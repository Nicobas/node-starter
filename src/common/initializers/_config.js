/* eslint-disable no-console,no-process-exit */

const crypto = require('crypto');
const fs = require('fs').promises;
const dotenv = require('dotenv');

const algorithm = 'aes-256-ctr';

module.exports = async () => {
    dotenv.config();

    const env_name = process.env.CONFIG_NAME;
    const env_password = process.env.CONFIG_PASSWORD;

    if (!env_name) {
        throw new Error('CONFIG_NAME env variable is missing');
    }

    if (!env_password) {
        throw new Error('CONFIG_PASSWORD env variable is missing');
    }

    const config_path = 'config/config.' + env_name + '.js.enc';

    const key = crypto.createHash('sha256').update(String(env_password)).digest('base64').substr(0, 32);

    const buffer = await fs.readFile(config_path);

    const iv = buffer.slice(0, 16);
    const encrypted = buffer.slice(16);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let config;

    try {
        const buffer = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        config = eval(buffer.toString());

        global.CONFIG = config;
    } catch (e) {
        console.error('CONFIG_PASSWORD env variable is not valid');
        process.exit(1);
    }
};
