const express = require('express');
const { getEmployees, createEmployee, loginEmployee, getEmployeeById, updateEmployee, deleteEmployee, previewPDF, generatePDF } = require('../controller/emp.controller');
const router = express.Router();


// 🛑 Static routes must be defined before dynamic routes
router.get('/preview-emp', previewPDF);
router.get('/download-emp', generatePDF);

router.get('/',getEmployees);

router.post('/',createEmployee);
router.post('/login',loginEmployee);

router.get('/:id', getEmployeeById); // Get Employee by ID
router.put('/:id', updateEmployee); // Get Employee by ID
router.delete('/:id', deleteEmployee); // Get Employee by ID





module.exports=router;