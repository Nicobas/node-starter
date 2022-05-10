const mongoose = require('mongoose');

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
            enum: CONFIG.settings.tasks_status,
            default: 'Todo',
        },
        _project: {
            type: ObjectId,
            ref: 'Project',
        },
        _author: {
            type: ObjectId,
            ref: 'User',
        },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

module.exports = mongoose.model('Task', TaskSchema);
