module.exports = {
    project_name: 'Node starter',
    settings: {
        user_auth_jwt_lifetime: 3600, // = 1 heure
        user_refresh_jwt_lifetime: 15778800, // = 6 mois
        tasks_status: ['Todo', 'Doing', 'Done'],
    },
    services: {
        api: {
            http: {
                port: 3000,
            },
        },
    },
};
