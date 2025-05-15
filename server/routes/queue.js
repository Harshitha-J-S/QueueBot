const express = require('express');
const db = require('../db');
const router = express.Router();

// Get queue for a shop
router.get('/:shop_number', async (req, res) => {
  const { shop_number } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM queues WHERE shop_number = ? ORDER BY created_at', [shop_number]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching queue' });
  }
});

// Add print job
router.post('/add', async (req, res) => {
  const { student_usn, shop_number, file_name } = req.body;
  try {
    await db.execute(
      'INSERT INTO queues (student_usn, shop_number, file_name) VALUES (?, ?, ?)',
      [student_usn, shop_number, file_name]
    );
    res.json({ message: 'Print job added' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding print job' });
  }
});

module.exports = router;
