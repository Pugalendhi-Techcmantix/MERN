const Product = require('../model/product.model');
const Emp = require('../model/employee.model');

const createProduct = async (req, res) => {
    try {
        const { name, price, description, category, empId } = req.body;

        // Find employee details
        const employee = await Emp.findById(empId);

        if (!employee) {
            return res.status(400).json({ message: "Invalid employee ID." });
        }

        // Create product with empId and roleId
        const product = new Product({
            name,
            price,
            description,
            category,
            empId,
            roleId: employee.roleId // Assign roleId from employee
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all products with employee details
const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('empId', 'name'); // Get employee name
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductsByEmployee  = async (req, res) => {
    try {
        const { empId } = req.params; // Get employee ID from URL

        // Find products only for the given employee ID
        const products = await Product.find({ empId }).populate('empId', 'name');

        if (products.length === 0) {
            return res.status(404).json({ message: "No products found for this employee." });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductsByEmployee,
};
