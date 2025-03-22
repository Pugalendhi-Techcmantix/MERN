const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    empId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee', // Reference to Employee model
        required: true
    },
    roleId: {
        type: mongoose.Schema.Types.Number, // Role ID reference (not ObjectId)
        ref: 'Role',
        required: true
    }
}, {
    timestamps: true
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
