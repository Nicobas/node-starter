const {
    response200,
    response201WithData,
    response400,
    response400WithMessage,
} = require('../../../common/helpers/expressResHelper');

const { hashPassword } = require('../../../common/helpers/cryptoHelper');

const { User } = require('../../../common/models');

const register = async (req, res) => {
    const { username, email, password } = req.body;

    const isUsernameUsed = await User.findOne({ username: username }, '_id');

    if (isUsernameUsed) {
        return response400WithMessage(res, 'Username is already used');
    }

    const isEmailUsed = await User.findOne({ email: email }, '_id');

    if (isEmailUsed) {
        return response400WithMessage(res, 'Email is already used');
    }

    const registerMode = 'Email';

    const passwordHash = await hashPassword(password);

    const newUser = new User({
        status: 'Active',
        username: username,
        password_hash: passwordHash,
        register_mode: registerMode,
        email: email,
    });

    await newUser.save();

    response201WithData(res, {
        user: {
            id: newUser._id,
            status: newUser.status,
        },
    });
};

const verifyUsername = async (req, res) => {
    const { username } = req.params;

    const isUsernameUsed = await User.findOne({ username: username }, '_id');

    if (isUsernameUsed) {
        return response400(res, {});
    }

    response200(res, {});
};

const verifyEmail = async (req, res) => {
    const { email } = req.params;

    const isEmailUsed = await User.findOne({ email: email }, '_id');

    if (isEmailUsed) {
        return response400(res, {});
    }

    response200(res, {});
};

module.exports = { register, verifyUsername, verifyEmail };
