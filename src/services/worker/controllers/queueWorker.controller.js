const { Task } = require('../../../common/models');

const generateReport = async (data) => {
    const task = await Task.findById(data.taskId, '_id status');

    // eslint-disable-next-line no-console
    console.log(task);

    //-- Génération du rapport ou traitement d'une autre tâche lourde ...
};

module.exports = { generateReport };
