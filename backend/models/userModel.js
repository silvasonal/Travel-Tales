const bcryptUtils = require('../utils/bcryptUtils');
const usersDao = require('../daos/usersDao');

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  try {
    // Check for duplicates
    const existingUsername = await usersDao.findUserByUsername(username);
    if (existingUsername) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const existingEmail = await usersDao.findUserByEmail(email);
    if (existingEmail) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Hash password and create user
    const hashedPassword = await bcryptUtils.hashPassword(password);
    const user = await usersDao.createUser(username, email, hashedPassword);

    return res.status(201).json({
      message: 'User created successfully',
      user
    });

  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ error: 'Error registering user' });
  }
};

module.exports = {
  registerUser
};
