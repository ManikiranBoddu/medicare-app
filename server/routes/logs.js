// E:\medicare-app\server\routes\logs.js
const express = require('express');
const router = express.Router();
const path = require('path');

// Get all logs for a user
router.get('/user/:id', (req, res) => {
  req.db.all(
    `SELECT * FROM logs WHERE user_id = ?`,
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Create a single log
router.post('/', (req, res) => {
  const { medication_id, status, taken_at, photo_url } = req.body;
  if (!medication_id || !status || !taken_at) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }
  req.db.run(
    `INSERT INTO logs (user_id, medication_id, status, taken_at, photo_url) VALUES (?, ?, ?, ?, ?)`,
    [req.user.id, medication_id, status, taken_at, photo_url || null],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id: this.lastID,
        user_id: req.user.id,
        medication_id,
        status,
        taken_at,
        photo_url
      });
    }
  );
});

// Create multiple logs (bulk)
router.post('/bulk', (req, res) => {
  const logs = req.body;
  if (!Array.isArray(logs) || logs.length === 0) {
    return res.status(400).json({ error: 'Logs array is required' });
  }

  const insertedLogs = [];
  const stmt = req.db.prepare(
    `INSERT INTO logs (user_id, medication_id, status, taken_at, photo_url) VALUES (?, ?, ?, ?, ?)`
  );

  try {
    req.db.serialize(() => {
      logs.forEach(log => {
        const { medication_id, status, taken_at, photo_url } = log;
        if (!medication_id || !status || !taken_at) {
          throw new Error('Required fields are missing in log entry');
        }
        const result = stmt.run(req.user.id, medication_id, status, taken_at, photo_url || null);
        insertedLogs.push({
          id: result.lastID,
          user_id: req.user.id,
          medication_id,
          status,
          taken_at,
          photo_url
        });
      });
    });
    res.json(insertedLogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload photo for a log
router.post('/upload', (req, res, next) => {
  const uploadSingle = req.app.get('upload').single('photo');
  uploadSingle(req, res, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ photo_url: `/uploads/${req.file.filename}` });
  });
});

module.exports = router;