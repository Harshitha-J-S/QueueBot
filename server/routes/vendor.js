const express = require('express');
const router = express.Router();
const db = require('../db'); // Your MySQL connection module

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log('Received login attempt:', username, password); // Debug

  try {
    const [rows] = await db.execute(
      'SELECT * FROM vendors WHERE username = ? AND password = ?',
      [username, password]
    );

    console.log('DB query result:', rows); // Debug

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', vendor: rows[0] });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
