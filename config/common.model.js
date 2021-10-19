module.exports = {
    project_name: 'Node starter',
    env_type: 'dev',
    env_name: 'localhost',
    env_config: {},
    authentication_credentials: {
        mongodb_uri: 'mongodb://localhost:27017/starter',
        jwt_secret: 'un super secret',
    },
    settings: {
        user_auth_jwt_lifetime: 3600, // = 1 heure
        user_refresh_jwt_lifetime: 15778800, // = 6 mois
        tasks_status: ['Todo', 'Doing', 'Done'],
    },
    logs: {
        console: false,
        file: false,
        debug: true,
    },
    services: {
        api: {
            http: {
                port: 3000,
                is_nginx_proxy_enabled: false,
                external_url: 'http://localhost:3000/',
            },
        },
    },
};
