const express = require('express');
const router = express.Router();
const pool = require('../db');
const verifyToken = require('../middleware/auth');

// Get athlete profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, age, gender, state, email, created_at FROM athletes WHERE id = $1',
      [req.athleteId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Athlete not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all athletes (for SAI dashboard)
router.get('/all', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, age, gender, state, created_at FROM athletes ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;