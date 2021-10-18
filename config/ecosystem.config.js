const CONFIG = require('./config');

const knownServices = ['api'];

const apps = [];

knownServices.forEach((item) => {
    const service = CONFIG.server.services[item];

    if (!service) {
        return;
    }

    const app = {
        name: item,
        script: './src/services/' + item + '/' + item + '.js',
    };

    if (service.is_cluster_mode) {
        app.exec_mode = 'cluster';
        app.instances = service.number_of_instances;
    }

    apps.push(app);
});

module.exports = {
    apps,
};
