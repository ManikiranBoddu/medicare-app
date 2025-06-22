// E:\medicare-app\server\index.js
const express = require('express');
const db = require('./db/db');
const authRoutes = require('./routes/auth');
const medicationsRoutes = require('./routes/medications');
const logsRoutes = require('./routes/logs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });
app.set('upload', upload); // Make upload available to routes

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to attach db to request
app.use((req, res, next) => {
  req.db = db;
  const token = req.headers['authorization'];
  if (token) req.user = { id: 1 }; // Mock user ID (replace with JWT verification)
  next();
});

// Use route modules
app.use('/api/auth', authRoutes);
app.use('/api/medications', medicationsRoutes);
app.use('/api/logs', logsRoutes);

const PORT = process.env.PORT || 3001;

// Schedule reminders every minute (for testing)
setInterval(() => {
  db.all(
    `SELECT m.id, m.name, m.frequency 
     FROM medications m 
     WHERE m.user_id = ?`,
    [1],
    (err, rows) => {
      if (err) console.error('Error fetching medications for reminders:', err.message);
      if (rows) {
        rows.forEach(row => {
          console.log(`Reminder: Take ${row.name} (${row.frequency})`);
        });
      }
    }
  );
}, 60000);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));