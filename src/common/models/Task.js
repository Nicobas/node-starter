const mongoose = require('mongoose');

const CONFIG = require('../../../config/config');

const { Schema, ObjectId } = mongoose;

const TaskSchema = new Schema(
    {
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        due_date: {
            type: Date,
        },
        status: {
            type: String,
            enum: CONFIG.common.settings.tasks_status,
            default: 'Todo',
        },
        _author: {
            type: ObjectId,
            ref: 'User',
        },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

module.exports = mongoose.model('Task', TaskSchema);
