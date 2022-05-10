const RegexEscape = require('regex-escape');

const { response200WithData, response201WithData, response204 } = require('../../../common/helpers/expressRes.helper');

const { Project } = require('../../../common/models');

const createProject = async (req, res) => {
    const { title } = req.body;

    const newProject = new Project({
        title: title,
        _author: req.me,
    });

    await newProject.save();

    const data = {
        id: newProject._id,
        title: newProject.title,
    };

    response201WithData(res, data);
};

const getProjects = async (req, res) => {
    const { search, limit, offset } = req.query;

    const filter = {};

    if (search) {
        filter.title = { $regex: RegexEscape(search), $options: 'i' };
    }

    const projects = await Project.find(filter, 'title').sort({ created_at: -1 }).skip(offset).limit(limit);

    if (projects.length === 0) {
        return response204(res);
    }

    const data = projects.map((item) => {
        return {
            id: item._id,
            title: item.title,
        };
    });

    response200WithData(res, data);
};

module.exports = {
    createProject,
    getProjects,
};
