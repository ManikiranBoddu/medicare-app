// E:\medicare-app\server\db\db.js
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('E:\\medicare-app\\server\\medicare.db', (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
  console.log('Connected to database');

  // Initialize or update medications table schema
  db.run(`
    CREATE TABLE IF NOT EXISTS medications (
      id INTEGER PRIMARY KEY,
      user_id INTEGER,
      name TEXT NOT NULL,
      dosage TEXT NOT NULL,
      frequency TEXT,
      time TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) console.error('Error creating medications table:', err.message);
    else {
      // Check and add time column if missing
      db.all(`PRAGMA table_info(medications)`, (err, columns) => {
        if (err) console.error('Error checking schema:', err.message);
        else {
          const hasTime = columns.some(col => col.name === 'time');
          if (!hasTime) {
            db.run(`ALTER TABLE medications ADD COLUMN time TEXT`, (err) => {
              if (err) console.error('Error adding time column:', err.message);
              else console.log('Added time column to medications table.');
            });
          } else {
            console.log('Medications table schema is valid.');
          }
        }
      });
    }
  });

  // Initialize logs table schema
  db.run(`
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY,
      user_id INTEGER,
      medication_id INTEGER,
      status TEXT DEFAULT 'taken',
      taken_at DATETIME,
      photo_url TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (medication_id) REFERENCES medications(id)
    )
  `, (err) => {
    if (err) console.error('Error creating logs table:', err.message);
  });

  // Initialize users table schema
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    )
  `, (err) => {
    if (err) console.error('Error creating users table:', err.message);
  });
});

module.exports = db;