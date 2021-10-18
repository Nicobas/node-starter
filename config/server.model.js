const app_path = '/Users/nicobas/workspace/perso/node-starter/';

module.exports = {
    id: 'localhost',
    paths: {
        app: app_path,
        logs: app_path + 'dev/tmp/logs/',
        data: app_path + 'dev/tmp/data/',
        tmp: app_path + 'dev/tmp/tmp/',
    },
    services: {
        api: {
            is_cluster_mode: false,
            number_of_instances: 1,
        },
    },
};
