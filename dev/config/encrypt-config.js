/* eslint-disable no-console,no-process-exit */

const crypto = require('crypto');
const fs = require('fs').promises;
const util = require('util');
const read = require('read');

const readAsync = util.promisify(read);

const algorithm = 'aes-256-ctr';

const run = async () => {
    const env = await readAsync({ prompt: 'CONFIG_NAME : ' });
    const password = await readAsync({ prompt: 'CONFIG_PASSWORD : ', silent: true });

    const fileIn = 'config/config.' + env + '.secret.js';
    const fileOut = 'config/config.' + env + '.secret.js.enc';

    const key = crypto.createHash('sha256').update(String(password)).digest('base64').substr(0, 32);

    try {
        //-- si une config chiffrée existe déjà, on verifie que le password est le même

        const buffer = await fs.readFile(fileOut);

        const iv = buffer.slice(0, 16);
        const encrypted = buffer.slice(16);
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        const result = Buffer.concat([decipher.update(encrypted), decipher.final()]);

        try {
            eval(result.toString());
        } catch (e) {
            console.error('\nCONFIG_PASSWORD doesn\'t match with the current encrypted config "' + fileOut + '"');
            process.exit(1);
        }

        // eslint-disable-next-line no-empty
    } catch (e) {}

    let buffer;

    try {
        buffer = await fs.readFile(fileIn);
    } catch (e) {
        console.error('\nConfig file "' + fileIn + '" doesn\'t exist');
        process.exit(1);
    }

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);

    await fs.writeFile(fileOut, result);

    console.info('\nConfig encrypted to "' + fileOut + '"');
};

run();
