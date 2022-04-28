const figlet = require('figlet');

const showServiceTitle = (serviceName) => {
    //eslint-disable-next-line no-console
    console.info('\n');

    const title = figlet.textSync(CONFIG.project_name.toUpperCase() + ' ' + serviceName.toUpperCase(), {
        font: 'Doom',
        horizontalLayout: 'default',
        verticalLayout: 'default',
    });

    //eslint-disable-next-line no-console
    console.info(title);
};

module.exports = {
    showServiceTitle,
};
