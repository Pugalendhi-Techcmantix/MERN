const express = require('express');
const { createProduct, getProducts, getProductsByEmployee } = require('../controller/orders.controller');
const router = express.Router();

router.post('/', createProduct); // Add product
router.get('/', getProducts); // Get all products
router.get('/:empId', getProductsByEmployee); // Get all products

module.exports = router;
