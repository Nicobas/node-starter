module.exports = {
    project_name: 'Node starter',
    settings: {
        user_access_jwt_lifetime: 3600, // = 1 heure
        user_refresh_jwt_lifetime: 15778800, // = 6 mois
        tasks_status: ['Todo', 'Doing', 'Done'],
    },
    services: {
        api: {
            http: {
                port: 3000,
            },
        },
        cron: {
            schedules: {
                countTasks: '00 * * * * *',
            },
        },
        worker: {
            queue: {
                concurrency: 1,
            },
        },
    },
};
