const Product = require('../model/products.model');
const Employee = require('../model/employee.model'); // Ensure you have an Employee model

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { productName, category, price, description, color, createdBy } = req.body;

    // Check if employee exists
    const employee = await Employee.findById(createdBy);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const product = new Product({
      productName,
      category,
      price,
      description,
      color,
      createdBy: createdBy,
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all products with employee details
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('createdBy', 'name email ');
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('createdBy', 'name email');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { productName, category, price, description, color } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { productName, category, price, description, color },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
}