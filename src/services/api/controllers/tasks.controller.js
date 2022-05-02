const RegexEscape = require('regex-escape');

const {
    response200WithData,
    response201WithData,
    response204,
    response403WithMessage,
    response201WithMessage,
} = require('../../../common/helpers/expressResHelper');

const { Task, User } = require('../../../common/models');

const createTask = async (req, res) => {
    const { title, description, dueDate, status } = req.body;

    const newTask = new Task({
        title: title,
        description: description,
        due_date: dueDate,
        status: status,
        _author: req.me,
    });

    await newTask.save();

    const data = {
        id: newTask._id,
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.due_date,
        status: newTask.status,
        author: {
            id: newTask._author._id,
            username: newTask._author.username,
        },
    };

    response201WithData(res, data);
};

const getTasks = async (req, res) => {
    const { search, status, limit, offset } = req.query;

    const filter = {};

    if (search) {
        filter.title = { $regex: RegexEscape(search), $options: 'i' };
    }

    if (status) {
        filter.status = status;
    }

    const tasks = await Task.find(filter, 'title description due_date status _author')
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
            author: {
                id: item._author._id,
                username: item._author.username,
            },
        };
    });

    response200WithData(res, data);
};

const getTask = async (req, res) => {
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
};

const deleteTask = async (req, res) => {
    if (!req.task._author.equals(req.me._id)) {
        return response403WithMessage(res, 'Only the author can remove the task');
    }

    await req.task.remove();

    response204(res);
};

const generateTaskReport = async (req, res) => {
    const job = SERVICE.queues.worker.createJob({
        type: 'tasks.generateReport',
        taskId: req.task.id,
    });

    await job.save();

    response201WithMessage(res, 'Report generation has been queued');
};

module.exports = {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask,
    generateTaskReport,
};
