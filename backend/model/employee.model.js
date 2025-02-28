const mongoose = require('mongoose');

const empSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensures no duplicate emails
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
    },
    roleId: {
        type: mongoose.Schema.Types.Number, // Reference by roleId (not ObjectId)
        ref: 'Role', // Referencing Role model
        required: true
    }
}, {
    timestamps: true
});

const Emp = mongoose.model("Employee", empSchema);
module.exports = Emp;
