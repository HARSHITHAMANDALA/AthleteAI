const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// Register a new athlete
router.post('/register', async (req, res) => {
  const { name, age, gender, state, email, password } = req.body;
  try {
    // Check if athlete already exists
    const existing = await pool.query('SELECT * FROM athletes WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Save to database
    const result = await pool.query(
      'INSERT INTO athletes (name, age, gender, state, email, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, age, gender, state, email, hashedPassword]
    );
    res.status(201).json({ message: 'Athlete registered successfully', athlete: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM athletes WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const athlete = result.rows[0];
    const isMatch = await bcrypt.compare(password, athlete.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: athlete.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login successful', token, athlete });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;