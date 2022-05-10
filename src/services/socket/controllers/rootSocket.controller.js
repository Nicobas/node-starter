const logger = require('winston');
const { Joi } = require('celebrate');

const { Project } = require('../../../common/models');

const validatePayloadAndLoadProject = async (payload) => {
    try {
        if (typeof payload === 'string') {
            payload = JSON.parse(payload);
        }

        const schema = Joi.object({
            projectId: Joi.objectId().required(),
        });

        const { value, error } = await schema.validate(payload);

        if (error) {
            return { err: error };
        }

        const project = await Project.findById(value.projectId, '_id');

        if (!project) {
            return { err: 'Project not found' };
        }

        return { project };
    } catch (err) {
        return { err };
    }
};

const getSubscribedProjectIds = (socket) => {
    return [...socket.rooms]
        .filter((o) => /^project_([0-9a-f]+)$/.test(o))
        .map((o) => o.match(/^project_([0-9a-f]+)$/)[1]);
};

const projectSubscribe = async (socket, payload) => {
    const { err, project } = await validatePayloadAndLoadProject(payload);

    if (err) {
        socket.emit('project.subscribe.error', { error: err.message || err });
        logger.info('Socket ' + socket.id + ' - project.subscribe.error emitted');
        return;
    }

    socket.join('project_' + project._id);
    logger.info('Socket ' + socket.id + ' - Room project_' + project._id + ' joined');

    socket.emit('project.subscribe.ok', { subscribedProjectIds: getSubscribedProjectIds(socket) });
    logger.info('Socket ' + socket.id + ' - project.subscribe.ok emitted');
};

const projectUnsubscribe = async (socket, payload) => {
    const { err, project } = await validatePayloadAndLoadProject(payload);

    if (err) {
        socket.emit('project.unsubscribe.error', { error: err.message });
        logger.info('Socket ' + socket.id + ' - project.unsubscribe.error emitted');
        return;
    }

    socket.leave('project_' + project._id);
    logger.info('Socket ' + socket.id + ' - Room project_' + project._id + ' left');

    socket.emit('project.unsubscribe.ok', { subscribedProjectIds: getSubscribedProjectIds(socket) });
    logger.info('Socket ' + socket.id + ' - project.unsubscribe.ok emitted');
};

module.exports = { projectSubscribe, projectUnsubscribe };
