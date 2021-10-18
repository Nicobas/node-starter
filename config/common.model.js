module.exports = {
    project_name: 'Node starter',
    env_type: 'dev',
    env_name: 'localhost',
    env_config: {},
    authentication_credentials: {
        mongodb_uri: 'mongodb://localhost:27017/starter',
        jwt_secret: 'azer1234',
    },
    settings: {},
    logs: {
        console: false,
        file: true,
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
