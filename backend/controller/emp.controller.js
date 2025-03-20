const Emp = require('../model/employee.model');
const Role = require('../model/role.model');
const jwt = require('jsonwebtoken');
const PDFDocument = require('pdfkit');
const CryptoJS = require('crypto-js');
require('dotenv').config(); // Load environment variables
const secretKey = process.env.SECRET_KEY; // Load SECRET_KEY from .env

// Encrypt Password
const encryptPassword = (password) => {
  return CryptoJS.AES.encrypt(password, secretKey).toString();
};

// Decrypt Password
const decryptPassword = (encryptedPassword) => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const createEmployee = async (req, res) => {
  try {
    const { name, email, password, age, roleName } = req.body;

    // Check if email is already in use
    const existingEmp = await Emp.findOne({ email });
    if (existingEmp) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    // Find roleId based on roleName
    const role = await Role.findOne({ name: roleName });

    if (!role) {
      return res
        .status(400)
        .json({ message: "Invalid role name. Choose 'Admin' or 'User'." });
    }

    // Encrypt password before saving
    const encryptedPassword = encryptPassword(password);
    // Create employee with roleId
    const employee = new Emp({
      name,
      email,
      password: encryptedPassword,
      age,
      roleId: role.roleId,
    });

    await employee.save();
    res.status(201).json({ message: 'Employee created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEmployees = async (req, res) => {
  try {
    const getEmployees = await Emp.find();
    res.status(200).json(getEmployees);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get Single Employee by ID
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find employee by ID
    const employee = await Emp.findById(id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Find role name based on roleId
    const role = await Role.findOne({ roleId: employee.roleId });
    const roleName = role ? role.name : 'Unknown';

    // Decrypt the password before sending response
    const decryptedPassword = decryptPassword(employee.password);

    res
      .status(200)
      .json({ ...employee._doc, roleName, password: decryptedPassword });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, age, roleName } = req.body;

    // Find the employee by ID
    const employee = await Emp.findById(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if email is already in use (excluding the current employee)
    if (email && email !== employee.email) {
      const existingEmp = await Emp.findOne({ email });
      if (existingEmp) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      employee.email = email;
    }

    // Update roleId based on roleName
    if (roleName) {
      const role = await Role.findOne({ name: roleName });
      if (!role) {
        return res
          .status(400)
          .json({ message: "Invalid role name. Choose 'Admin' or 'User'." });
      }
      employee.roleId = role.roleId;
    }

    // Update other fields
    employee.name = name || employee.name;
    employee.age = age || employee.age;

    // Encrypt new password before updating (if provided)
    if (password) {
      const secretKey = process.env.SECRET_KEY;
      employee.password = CryptoJS.AES.encrypt(password, secretKey).toString();
    }

    await employee.save();

    res.status(200).json({ message: 'Employee updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Emp.findByIdAndDelete(id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const employee = await Emp.findOne({ email });
    if (!employee) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Decrypt stored password and compare
    const decryptedPassword = decryptPassword(employee.password);
    if (decryptedPassword !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { empId: employee._id, roleId: employee.roleId },
      'secretkey', // Change to env variable
      { expiresIn: '1h' },
    );

    // Send only email, roleId, and name in the response
    const employeeData = {
      email: employee.email,
      roleId: employee.roleId,
      name: employee.name,
    };

    res
      .status(200)
      .json({ message: 'Login successful', token, employee: employeeData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const previewPDF = async (req, res) => {
  try {
    // Fetch all roles and store in a map (roleId -> roleName)
    const roles = await Role.find(); // Fetch all roles once
    const roleMap = {};
    roles.forEach((role) => {
      roleMap[role.roleId] = role.name; // Store roleId -> roleName
    });
    const employees = await Emp.find(); // Fetch all employees

    // Create PDF Document
    const doc = new PDFDocument({ margin: 30 });

    // Set Headers
    res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', 'attachment; filename=employees.pdf');

    // Pipe PDF to response
    doc.pipe(res);

    // Add Title
    doc.fontSize(20).text('Employee Report', { align: 'center' }).moveDown(1);

    // Table Headers
    const startX = 50;
    let y = 120;
    doc
      .fillColor('black')
      .fontSize(14)
      .text('Name', startX, y)
      .text('Email', startX + 150, y)
      .text('Age', startX + 350, y)
      .text('Role', startX + 400, y);

    doc
      .moveTo(50, y + 20)
      .lineTo(550, y + 20)
      .stroke(); // Line separator
    y += 30;

    // Add Employee Data
    employees.forEach((emp) => {
      const roleName = roleMap[emp.roleId] || 'Unknown'; // Get role name from map
      doc
        .fillColor('black')
        .fontSize(12)
        .text(emp.name, startX, y)
        .text(emp.email, startX + 150, y)
        .text(emp.age.toString(), startX + 350, y)
        .text(roleName, startX + 400, y);
      y += 25;
    });

    // Finalize
    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};





const generatePDF = async (req, res) => {
  try {
    // Fetch all roles and store in a map (roleId -> roleName)
    const roles = await Role.find(); // Fetch all roles once
    const roleMap = {};
    roles.forEach((role) => {
      roleMap[role.roleId] = role.name; // Store roleId -> roleName
    });
    const employees = await Emp.find(); // Fetch all employees

    // Create PDF Document
    const doc = new PDFDocument({ margin: 30 });

    // Set Headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=employees.pdf');

    // Pipe PDF to response
    doc.pipe(res);

    // Add Title
    doc.fontSize(20).text('Employee Report', { align: 'center' }).moveDown(1);

    // Table Headers
    const startX = 50;
    let y = 120;
    doc
      .fillColor('black')
      .fontSize(14)
      .text('Name', startX, y)
      .text('Email', startX + 150, y)
      .text('Age', startX + 350, y)
      .text('Role', startX + 400, y);

    doc
      .moveTo(50, y + 20)
      .lineTo(550, y + 20)
      .stroke(); // Line separator
    y += 30;

    // Add Employee Data
    employees.forEach((emp) => {
      const roleName = roleMap[emp.roleId] || 'Unknown'; // Get role name from map
      doc
        .fillColor('black')
        .fontSize(12)
        .text(emp.name, startX, y)
        .text(emp.email, startX + 150, y)
        .text(emp.age.toString(), startX + 350, y)
        .text(roleName, startX + 400, y);
      y += 25;
    });

    // Finalize
    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  loginEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  previewPDF,
  generatePDF,
};
