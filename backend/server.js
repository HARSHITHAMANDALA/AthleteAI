const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./src/db');
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/athletes', require('./src/routes/athletes'));
app.use('/api/assessments', require('./src/routes/assessments'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'AthleteAI Backend is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});