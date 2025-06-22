// E:\medicare-app\server\routes\auth.js
const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  req.db.run(
    `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`,
    [email, password, role],
    (err) => {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: err.message });
      }
      const token = 'dummy-token'; // Mock token (replace with JWT in production)
      res.status(201).json({ message: 'User registered successfully', token, role });
    }
  );
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  req.db.get(
    `SELECT * FROM users WHERE email = ? AND password = ?`,
    [email, password],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(401).json({ error: 'Invalid credentials' });
      const token = 'dummy-token'; // Mock token (replace with JWT in production)
      res.json({ token, role: row.role });
    }
  );
});

module.exports = router;