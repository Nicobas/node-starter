const moment = require('moment');
const Jimp = require('jimp');

const {
    response200WithData,
    response201WithData,
    response400WithMessage,
} = require('../../../common/helpers/expressRes.helper');
const { generateToken } = require('../../../common/helpers/random.helper');
const { uploadFileFromBuffer, getFileSignedUrl } = require('../../../common/helpers/s3.helper');

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

    let imageBuffer;

    try {
        const image = await Jimp.read(req.file.buffer);
        image.cover(500, 500).quality(60);
        imageBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);
    } catch (e) {
        return response400WithMessage(res, 'File cannot be read as a picture');
    }

    const fileName = generateToken() + '.jpeg';

    const key = CONFIG.env_name + '/avatars/' + moment(req.currentDate).format('YYYY-MM-DD') + '/' + fileName;

    await uploadFileFromBuffer(upload_bucket, key, imageBuffer, file.mimetype);

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
