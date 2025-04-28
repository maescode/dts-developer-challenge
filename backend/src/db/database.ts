import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';

const dbFile = process.env.NODE_ENV === 'test' ? ':memory:' : 'tasks.db';
const db: Database = new sqlite3.Database(dbFile);

// Create tasks table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL,
      due_date DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

export default db;