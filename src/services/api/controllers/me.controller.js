const moment = require('moment');
const mime = require('mime-types');

const {
    response200WithData,
    response201WithData,
    response400WithMessage,
} = require('../../../common/helpers/expressResHelper');
const { generateToken } = require('../../../common/helpers/randomHelper');
const { uploadFileFromBuffer, getFileSignedUrl } = require('../../../common/helpers/s3Helper');

const { upload_bucket } = CONFIG.credentials.s3;

const getProfile = async (req, res) => {
    const avatarUri =
        !req.me.avatar || !req.me.avatar.key ? null : getFileSignedUrl(req.me.avatar.bucket, req.me.avatar.key);

    response200WithData(res, {
        id: req.me._id,
        status: req.me.status,
        username: req.me.username,
        email: req.me.email,
        registerMode: req.me.register_mode,
        lastAuthenticationDate: req.me.last_authentication_date,
        avatarUri,
    });
};

const setAvatar = async (req, res) => {
    const { file } = req;

    if (!file) {
        return response400WithMessage(res, 'File is missing');
    }

    const fileName = generateToken() + '.' + mime.extension(file.mimetype);

    const key = CONFIG.env_name + '/avatars/' + moment(req.currentDate).format('YYYY-MM-DD') + '/' + fileName;

    await uploadFileFromBuffer(upload_bucket, key, file.buffer, file.mimetype);

    req.me.avatar = {
        bucket: upload_bucket,
        key,
    };

    await req.me.save();

    response201WithData(res, {
        avatarUri: getFileSignedUrl(req.me.avatar.bucket, req.me.avatar.key),
    });
};

module.exports = {
    getProfile,
    setAvatar,
};
