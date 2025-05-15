const express = require('express');
const router = express.Router();
const db = require('../db'); // adjust path if needed

router.post('/submit', async (req, res) => {
  const { filename, usn, shop_number } = req.body;

  if (!filename || !usn || !shop_number) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    await db.execute(
      'INSERT INTO print_jobs (filename, usn, shop_number, status, submitted_at) VALUES (?, ?, ?, ?, NOW())',
      [filename, usn, shop_number, 'pending']
    );
    res.status(200).json({ message: 'Print job submitted successfully' });
  } catch (error) {
    console.error('Error submitting print job:', error);
    res.status(500).json({ message: 'Server error during job submission' });
  }
});

module.exports = router;
