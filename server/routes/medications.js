const express = require('express');
const router = express.Router();

router.get('/user/:id', (req, res) => {
  req.db.all(
    `SELECT * FROM medications WHERE user_id = ?`,
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: `Database error: ${err.message}` });
      res.json(rows);
    }
  );
});

router.post('/', (req, res) => {
  const { name, dosage, frequency, time, user_id } = req.body;
  console.log('Received medication data:', req.body); // Debug log

  if (!name || !dosage || !frequency || !time || !user_id) {
    return res.status(400).json({ error: 'All fields (name, dosage, frequency, time, user_id) are required' });
  }

  // Log current table schema for debugging
  req.db.all(`PRAGMA table_info(medications)`, (err, columns) => {
    if (err) console.error('Error checking schema:', err.message);
    else console.log('Medications table columns:', columns.map(col => col.name));
  });

  req.db.run(
    `INSERT INTO medications (user_id, name, dosage, frequency, time) VALUES (?, ?, ?, ?, ?)`,
    [user_id, name, dosage, frequency, time],
    function (err) {
      if (err) {
        console.error('Database error:', err.message); // Debug log
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res.status(400).json({ error: 'A database constraint was violated (e.g., duplicate entry or invalid user_id)' });
        }
        return res.status(500).json({ error: `Failed to add medication: ${err.message}` });
      }
      req.db.get(
        `SELECT * FROM medications WHERE id = ?`,
        [this.lastID],
        (err, row) => {
          if (err) return res.status(500).json({ error: `Failed to fetch new medication: ${err.message}` });
          res.status(201).json(row);
        }
      );
    }
  );
});

router.delete('/:id', (req, res) => {
  req.db.run(
    `DELETE FROM medications WHERE id = ? AND user_id = ?`,
    [req.params.id, req.user.id || 1], // Fallback to 1 if auth fails
    function (err) {
      if (err) return res.status(500).json({ error: `Database error: ${err.message}` });
      if (this.changes === 0) return res.status(404).json({ error: 'Medication not found or unauthorized' });
      req.db.run(
        `DELETE FROM logs WHERE medication_id = ? AND user_id = ?`,
        [req.params.id, req.user.id || 1],
        (err) => {
          if (err) return res.status(500).json({ error: `Failed to delete logs: ${err.message}` });
          res.json({ message: 'Medication and associated logs deleted' });
        }
      );
    }
  );
});

module.exports = router;
