import db from '../db/database';

beforeEach(async () => {
  process.env.NODE_ENV = 'test';
  return new Promise<void>((resolve) => {
    db.serialize(() => {
      db.run('DROP TABLE IF EXISTS tasks', () => {
        db.run(`
          CREATE TABLE tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT NOT NULL,
            due_date DATETIME NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, () => resolve());
      });
    });
  });
});

afterAll((done) => {
  db.close(done);
});
