const Role = require('../model/role.model');

const getRoles = async (req, res) => {
  try {
    const getRoles = await Role.find();
    res.status(200).json(getRoles);
  } catch (error) {
    res.status(500).json(error);
  }
};
const createRole = async (req, res) => {
  try {
    const { name } = req.body;

    // Define role mapping
    const roleMapping = {
      Admin: 1,
      User: 2,
    };

    if (!roleMapping[name]) {
      return res
        .status(400)
        .json({ message: 'Invalid role name. Allowed values: Admin, User' });
    }

    // Check if the role already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ message: 'Role already exists' });
    }

    // Create role with auto-assigned roleId
    const newRole = new Role({
      name,
      roleId: roleMapping[name], // Assign roleId automatically
    });

    await newRole.save();
    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRole,
  getRoles,
};
