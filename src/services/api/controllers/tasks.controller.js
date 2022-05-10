const RegexEscape = require('regex-escape');

const {
    response200WithData,
    response201WithData,
    response204,
    response400WithMessage,
    response403WithMessage,
    response201WithMessage,
} = require('../../../common/helpers/expressRes.helper');

const { Task, User, Project } = require('../../../common/models');

const createTask = async (req, res) => {
    const { title, description, dueDate, status, projectId } = req.body;

    const project = await Project.findById(projectId, '_id title');

    if (!project) {
        return response400WithMessage('Project id is not valid');
    }

    const newTask = new Task({
        title: title,
        description: description,
        due_date: dueDate,
        status: status,
        _project: project,
        _author: req.me,
    });

    await newTask.save();

    const data = {
        id: newTask._id,
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.due_date,
        status: newTask.status,
        project: {
            id: newTask._project._id,
            title: newTask._project.title,
        },
        author: {
            id: newTask._author._id,
            username: newTask._author.username,
        },
    };

    response201WithData(res, data);

    await notifyTaskChange(newTask._project._id, 'creation', data);
};

const getTasks = async (req, res) => {
    const { search, status, projectId, limit, offset } = req.query;

    const filter = {};

    if (search) {
        filter.title = { $regex: RegexEscape(search), $options: 'i' };
    }

    if (status) {
        filter.status = status;
    }

    if (projectId) {
        filter._project = projectId;
    }

    const tasks = await Task.find(filter, 'title description due_date status _project _author')
        .populate('_project', '_id title')
        .populate('_author', '_id username')
        .sort({ created_at: -1 })
        .skip(offset)
        .limit(limit);

    if (tasks.length === 0) {
        return response204(res);
    }

    const data = tasks.map((item) => {
        return {
            id: item._id,
            title: item.title,
            description: item.description,
            dueDate: item.due_date,
            status: item.status,
            project: {
                id: item._project._id,
                title: item._project.title,
            },
            author: {
                id: item._author._id,
                username: item._author.username,
            },
        };
    });

    response200WithData(res, data);
};

const getTask = async (req, res) => {
    await Project.populate(req.task, {
        path: '_project',
        select: '_id title',
    });

    await User.populate(req.task, {
        path: '_author',
        select: '_id username',
    });

    const data = {
        id: req.task._id,
        title: req.task.title,
        description: req.task.description,
        dueDate: req.task.due_date,
        status: req.task.status,
        project: {
            id: req.task._project._id,
            title: req.task._project.title,
        },
        author: {
            id: req.task._author._id,
            username: req.task._author.username,
        },
    };

    response200WithData(res, data);
};

const updateTask = async (req, res) => {
    if (!req.task._author.equals(req.me._id)) {
        return response403WithMessage(res, 'Only the author can update the task');
    }

    const { title, description, dueDate, status } = req.body;

    if (title) {
        req.task.title = title;
    }
    if (description) {
        req.task.description = description;
    }
    if (dueDate) {
        req.task.due_date = dueDate;
    }
    if (status) {
        req.task.status = status;
    }

    await req.task.save();

    await User.populate(req.task, {
        path: '_author',
        select: '_id username',
    });

    const data = {
        id: req.task._id,
        title: req.task.title,
        description: req.task.description,
        dueDate: req.task.due_date,
        status: req.task.status,
        author: {
            id: req.task._author._id,
            username: req.task._author.username,
        },
    };

    response201WithData(res, data);

    await notifyTaskChange(req.task._project._id, 'update', data);
};

const deleteTask = async (req, res) => {
    if (!req.task._author.equals(req.me._id)) {
        return response403WithMessage(res, 'Only the author can remove the task');
    }

    await req.task.remove();

    response204(res);

    const data = { id: req.task._id };

    await notifyTaskChange(req.task._project, 'deletion', data);
};

const generateTaskReport = async (req, res) => {
    const job = SERVICE.queues.worker.createJob({
        type: 'tasks.generateReport',
        taskId: req.task.id,
    });

    await job.save();

    response201WithMessage(res, 'Report generation has been queued');
};

const notifyTaskChange = async (projectId, action, task) => {
    //-- Permet de créer un job sur le service socket qui notifiera les clients du changement par websocket

    const job = SERVICE.queues.socket.createJob({
        type: 'socket.emitTaskChange',
        projectId: projectId,
        action: action,
        task: task,
    });

    await job.save();
};

module.exports = {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask,
    generateTaskReport,
};
