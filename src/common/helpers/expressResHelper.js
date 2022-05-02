//-- 200 Ok

//-- do not use except exceptions
const response200 = (res, body) => {
    res.status(200).json(body);
};

const response200WithData = (res, data) => {
    response200(res, {
        data,
    });
};

const response200WithMessage = (res, message) => {
    response200(res, {
        message,
    });
};

const response200WithDataAndMessage = (res, data, message) => {
    response200(res, {
        data,
        message,
    });
};

//-- 201 Created

//-- do not use except exceptions
const response201 = (res, body) => {
    res.status(201).json(body);
};

const response201WithData = (res, data) => {
    response201(res, {
        data,
    });
};

const response201WithMessage = (res, message) => {
    response201(res, {
        message,
    });
};

const response201WithDataAndMessage = (res, data, message) => {
    response201(res, {
        data,
        message,
    });
};

//-- 204 No Content

const response204 = (res) => {
    res.status(204).send();
};

//-- 400 Bad Request

//-- do not use except exceptions
const response400 = (res, body) => {
    res.status(400).json(body);
};

const response400WithMessage = (res, message) => {
    response400(res, {
        message,
    });
};

const response400WithMessageAndCode = (res, message, code) => {
    response400(res, {
        message,
        code,
    });
};

//-- 401 Unauthorized

//-- do not use except exceptions
const response401 = (res, body) => {
    res.status(401).json(body);
};

const response401WithMessage = (res, message) => {
    response401(res, {
        message,
    });
};

//-- 403 Forbidden

//-- do not use except exceptions
const response403 = (res, body) => {
    res.status(403).json(body);
};

const response403WithMessage = (res, message) => {
    response403(res, {
        message,
    });
};

const response403WithMessageAndCode = (res, message, code) => {
    response403(res, {
        message,
        code,
    });
};

//-- 404 Not Found

//-- do not use except exceptions
const response404 = (res, body) => {
    res.status(404).json(body);
};

const response404WithMessage = (res, message) => {
    response404(res, {
        message,
    });
};

//-- 500 Internal Server Error

//-- do not use except exceptions
const response500 = (res, body) => {
    res.status(500).json(body);
};

const response500WithMessage = (res, message) => {
    response500(res, {
        message,
    });
};

module.exports = {
    response200,
    response200WithData,
    response200WithMessage,
    response200WithDataAndMessage,
    response201,
    response201WithData,
    response201WithMessage,
    response201WithDataAndMessage,
    response204,
    response400,
    response400WithMessage,
    response400WithMessageAndCode,
    response401,
    response401WithMessage,
    response403,
    response403WithMessage,
    response403WithMessageAndCode,
    response404,
    response404WithMessage,
    response500,
    response500WithMessage,
};
