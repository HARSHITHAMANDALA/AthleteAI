const express = require('express');
const router = express.Router();
const pool = require('../db');
const verifyToken = require('../middleware/auth');

// Submit a new assessment
router.post('/submit', verifyToken, async (req, res) => {
  const { test_type, video_url, ai_score, reps, duration } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO assessments (athlete_id, test_type, video_url, ai_score, reps, duration) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.athleteId, test_type, video_url, ai_score, reps, duration]
    );
    res.status(201).json({ message: 'Assessment submitted successfully', assessment: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all assessments for logged in athlete
router.get('/my', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM assessments WHERE athlete_id = $1 ORDER BY submitted_at DESC',
      [req.athleteId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all assessments (for SAI dashboard)
router.get('/all', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT a.*, ath.name, ath.age, ath.gender, ath.state FROM assessments a JOIN athletes ath ON a.athlete_id = ath.id ORDER BY a.submitted_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;