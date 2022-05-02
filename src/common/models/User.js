const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        status: {
            type: String,
            enum: ['Active', 'Blocked'],
            default: 'Active',
            index: true,
        },
        username: {
            type: String,
            index: true,
        },
        email: {
            type: String,
            index: true,
        },
        password_hash: {
            type: String,
        },
        last_authentication_date: {
            type: Date,
        },
        register_mode: {
            type: String,
            enum: ['Email'],
        },
        avatar: {
            bucket: {
                type: String,
            },
            key: {
                type: String,
            },
        },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

module.exports = mongoose.model('User', UserSchema);
