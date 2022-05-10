const logger = require('winston');

const controller = require('../controllers/rootSocket.controller');

const User = require('../../../common/models/User');

const { verifyUserAccessToken } = require('../../../common/helpers/jwt.helper');

const authorize = async (socket, next) => {
    const { token } = socket.handshake.auth;

    if (!token) {
        logger.info('Socket ' + socket.id + ' - Auth failed : JWT authorization token is required');

        return next(new Error('Unauthorized : JWT authorization token is required'));
    }

    const extractedToken = token.replace('JWT ', '');

    const decodedAuthToken = await verifyUserAccessToken(extractedToken);

    if (!decodedAuthToken) {
        logger.info('Socket ' + socket.id + ' - Auth failed : JWT authorization token is not valid (token)');

        return next(new Error('Unauthorized : JWT authorization token is not valid'));
    }

    const user = await User.findOne(
        {
            _id: decodedAuthToken.sub,
            status: 'Active',
        },
        '_id',
    );

    if (!user) {
        logger.info('Socket ' + socket.id + ' - Auth failed : JWT authorization token is not valid (user)');

        return next(new Error('Unauthorized : JWT authorization token is not valid'));
    }

    socket.join('user_' + user._id);

    logger.info('Socket ' + socket.id + ' - User ' + user._id + ' connected and joined his room');

    socket.user = user;

    next();
};

const handleStandardEvents = (socket) => {
    socket.on('disconnect', () => {
        logger.info('Socket ' + socket.id + ' - User ' + socket.user._id + ' disconnected');
    });

    socket.on('ding', () => {
        socket.emit('dong', {});
    });
};

const handleSubscribeEvents = (socket) => {
    socket.on('project.subscribe', (payload) => {
        controller.projectSubscribe(socket, payload);
    });

    socket.on('project.unsubscribe', (payload) => {
        controller.projectUnsubscribe(socket, payload);
    });
};

module.exports = (io) => {
    io.of('/').on('connection', async (socket) => {
        handleStandardEvents(socket);
        handleSubscribeEvents(socket);
    });

    io.of('/').use(authorize);
};
