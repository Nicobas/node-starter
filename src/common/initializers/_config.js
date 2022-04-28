/* eslint-disable no-console,no-process-exit */

const crypto = require('crypto');
const fs = require('fs').promises;
const dotenv = require('dotenv');

const algorithm = 'aes-256-ctr';

const mergeDeep = (target, source) => {
    const isObject = (obj) => obj && typeof obj === 'object';

    if (!isObject(target) || !isObject(source)) {
        return source;
    }

    Object.keys(source).forEach((key) => {
        const targetValue = target[key];
        const sourceValue = source[key];

        if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
            target[key] = targetValue.concat(sourceValue);
        } else if (isObject(targetValue) && isObject(sourceValue)) {
            target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);
        } else {
            target[key] = sourceValue;
        }
    });

    return target;
};

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

    const commonConfig = require('../../../config/config');
    const envConfig = require('../../../config/config.' + env_name);

    const secretEnvConfigPath = 'config/config.' + env_name + '.secret.js.enc';

    const key = crypto.createHash('sha256').update(String(env_password)).digest('base64').substr(0, 32);

    const buffer = await fs.readFile(secretEnvConfigPath);

    const iv = buffer.slice(0, 16);
    const encrypted = buffer.slice(16);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    try {
        const buffer = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        const secretEnvConfig = eval(buffer.toString());

        global.CONFIG = mergeDeep(mergeDeep(commonConfig, envConfig), secretEnvConfig);
    } catch (e) {
        console.error('CONFIG_PASSWORD env variable is not valid');
        process.exit(1);
    }
};
