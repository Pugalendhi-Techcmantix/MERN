const Emp = require('../model/employee.model');
const Role = require('../model/role.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 6);
    // Create employee with roleId
    const employee = new Emp({
      name,
      email,
      password: hashedPassword,
      age,
      roleId: role.roleId,
    });

    await employee.save();
    res
      .status(201)
      .json({ message: 'Employee created successfully', employee });
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

    res.status(200).json({ ...employee._doc, roleName });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;

    // Find the employee by ID
    const employee = await Emp.findById(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Update employee details
    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.age = age || employee.age;

    await employee.save();

    res
      .status(200)
      .json({ message: 'Employee updated successfully', employee });
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

    // Compare passwords
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
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
        name: employee.name
      };

    res.status(200).json({ message: 'Login successful', token ,employee: employeeData});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  loginEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
