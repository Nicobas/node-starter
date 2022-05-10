const mongoose = require('mongoose');

const { Schema, ObjectId } = mongoose;

const ProjectSchema = new Schema(
    {
        title: {
            type: String,
        },
        _author: {
            type: ObjectId,
            ref: 'User',
        },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

module.exports = mongoose.model('Project', ProjectSchema);
