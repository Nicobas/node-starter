const socketEmit = (namespace, rooms, event, data) => {
    const { io } = SERVICE;

    const nsp = rooms.reduce((acc, o) => acc.to(o), io.of(namespace));

    nsp.emit(event, data);
};

const countSocketRoomClients = async (namespace, room) => {
    return new Promise((resolve, reject) => {
        const { io } = SERVICE;

        io.of(namespace).adapter.clients([room], (err, clients) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(clients.length);
        });
    });
};

module.exports = {
    socketEmit,
    countSocketRoomClients,
};
