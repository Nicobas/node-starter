module.exports = {
    deploy: {
        dev: {
            host: 'server-host', //-- adresse du serveur (ip ou domaine)
            user: 'ssh-user', //-- utilisateur du serveur
            //key: 'path-to-ssh-key', //-- clé ssh de l'utilisateur (si besoin)
            ref: 'origin/dev', //-- branche a utiliser pour l'environnement
            repo: 'git@github.com:xxx/repo.git', //-- repo git ssh
            path: '.../node-starter', //-- dossier sur le serveur qui contient le code
            ssh_options: ['StrictHostKeyChecking=no', 'ForwardAgent=yes', 'ForwardAgent=yes'],
            'post-deploy': 'git pull && yarn install && pm2 startOrReload config/ecosystem.config.js',
            env: {
                NODE_ENV: 'development',
            },
        },
    },
};
