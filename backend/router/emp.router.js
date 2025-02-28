const express = require('express');
const { getEmployees, createEmployee, loginEmployee, getEmployeeById, updateEmployee, deleteEmployee } = require('../controller/emp.controller');
const router = express.Router();



router.get('/',getEmployees);

router.post('/',createEmployee);
router.post('/login',loginEmployee);

router.get('/:id', getEmployeeById); // Get Employee by ID
router.put('/:id', updateEmployee); // Get Employee by ID
router.delete('/:id', deleteEmployee); // Get Employee by ID





module.exports=router;