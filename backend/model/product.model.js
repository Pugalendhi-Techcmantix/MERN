const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
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

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
