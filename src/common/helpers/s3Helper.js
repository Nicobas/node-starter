const AWS = require('aws-sdk');
const fs = require('fs').promises;

const { access_key, secret_key, region, endpoint, force_path_style } = CONFIG.credentials.s3;

const config = new AWS.Config({
    accessKeyId: access_key,
    secretAccessKey: secret_key,
    region: region,
    endpoint: endpoint,
    s3ForcePathStyle: force_path_style,
    signatureVersion: 'v4',
});

const s3 = new AWS.S3(config);

const uploadFileFromBuffer = (bucket, key, buffer, mimeType) => {
    return s3
        .putObject({
            Bucket: bucket,
            Key: key,
            Body: buffer,
            ContentType: mimeType,
        })
        .promise();
};

const uploadFileFromPath = async (bucket, key, path, mimeType) => {
    return s3
        .putObject({
            Bucket: bucket,
            Key: key,
            Body: await fs.readFile(path),
            ContentType: mimeType,
        })
        .promise();
};

const downloadFileToPath = async (bucket, key, path) => {
    const res = await s3
        .getObject({
            Bucket: bucket,
            Key: key,
        })
        .promise();

    await fs.writeFile(path, res.Body);
};

const getFileSignedUrl = (bucket, key, expireSeconds = 3600) => {
    return s3.getSignedUrl('getObject', {
        Bucket: bucket,
        Key: key,
        Expires: expireSeconds,
    });
};

module.exports = {
    uploadFileFromBuffer,
    uploadFileFromPath,
    downloadFileToPath,
    getFileSignedUrl,
};
