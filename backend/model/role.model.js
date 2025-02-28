const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['Admin', 'User'], // Ensures only predefined roles are used
    },
    roleId: {
        type: Number,
        required: true,
        unique: true,
        enum: [1, 2] // Defines role numbers
    }
}, {
    timestamps: true
});

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;
