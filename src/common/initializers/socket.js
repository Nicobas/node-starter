const logger = require('winston');
const requiredir = require('require-dir');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

const initializer = () => {
    return async () => {
        const { httpServer, serviceName } = SERVICE;

        logger.info('[SOCKET] Initializing socket.io server');

        const io = new Server(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
        });

        logger.info('[SOCKET] Initializing redis adapter');

        const pubClient = createClient({ url: CONFIG.credentials.redis.uri });
        const subClient = pubClient.duplicate();

        await pubClient.connect();
        await subClient.connect();

        pubClient.on('error', (e) => {
            logger.warn('[SOCKET] Redis adapter pub client error : ' + e);
        });

        subClient.on('error', (e) => {
            logger.warn('[SOCKET] Redis adapter sub client error : ' + e);
        });

        io.adapter(createAdapter(pubClient, subClient));

        logger.info('[SOCKET] Initializing sockets');

        const socketPath = '../../services/' + serviceName + '/sockets/';
        const socketDirs = requiredir(socketPath);

        // Initialize all socket functions
        Object.values(socketDirs).forEach((item) => {
            item(io);
        });

        SERVICE.io = io;
    };
};

module.exports = initializer;
