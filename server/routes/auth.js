const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');  // Your MySQL connection instance

const router = express.Router();

const JWT_SECRET = 'your_jwt_secret_key';  // Replace with process.env.JWT_SECRET in production

// -------- SIGNUP ROUTE --------
router.post('/signup', async (req, res) => {
  const { username, password, usn, name, semester, role, shop_number } = req.body;

  // Validate required fields
  if (!username || !password || !usn || !name || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if user exists by username or USN
    const [existingUser] = await db.execute(
      'SELECT * FROM users WHERE username = ? OR usn = ?',
      [username, usn]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User with this username or USN already exists' });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into DB
    await db.execute(
      `INSERT INTO users (username, password, usn, name, semester, role, shop_number) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [username, hashedPassword, usn, name, semester || null, role, shop_number || null]
    );

    return res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Server error during signup' });
  }
});

// -------- LOGIN ROUTE --------
router.post('/login', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE username = ? AND role = ?',
      [username, role]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];

    // Compare password hash
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        usn: user.usn,
        username: user.username,
        role: user.role,
        shop_number: user.shop_number,
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({
      token,
      username: user.username,
      role: user.role,
      usn: user.usn,
      shop_number: user.shop_number,
      name: user.name,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
