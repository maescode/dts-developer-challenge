const sqlite3 = require('sqlite3');
const path = require('path');

const dbFile = 'tasks.db';
const db = new sqlite3.Database(dbFile);

const taskTitles = [
  'Review project documentation',
  'Update user interface',
  'Fix bug in login system',
  'Implement new feature',
  'Write unit tests',
  'Perform code review',
  'Update dependencies',
  'Create API documentation',
  'Optimize database queries',
  'Setup monitoring system',
  'Deploy to production',
  'Backup database',
  'Create user guide',
  'Security audit',
  'Performance testing',
  'Setup CI/CD pipeline',
  'Refactor legacy code',
  'Create backup strategy',
  'Update SSL certificates',
  'Configure load balancer'
];

const taskDescriptions = [
  'Review and update all documentation to ensure it is current and accurate',
  'Enhance user interface for better user experience',
  'Investigate and fix reported login issues',
  'Add new functionality as per requirements',
  'Create comprehensive test suite for core features',
  'Review code changes and provide feedback',
  'Update all project dependencies to latest stable versions',
  'Create detailed API documentation for developers',
  'Improve database performance through query optimization',
  'Set up system monitoring and alerting',
  'Deploy latest changes to production environment',
  'Perform regular database backup',
  'Create comprehensive user documentation',
  'Conduct thorough security assessment',
  'Test system performance under load',
  'Implement automated deployment pipeline',
  'Clean up and modernize legacy codebase',
  'Develop robust backup and recovery plan',
  'Renew and update SSL certificates',
  'Set up and configure load balancer for high availability'
];

const statuses = ['pending', 'in-progress', 'completed'];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomFutureDate() {
  const date = new Date();
  // Add random number of days (1-60) to current date
  date.setDate(date.getDate() + Math.floor(Math.random() * 60) + 1);
  return date.toISOString();
}

// Create table and populate it
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

  // Insert tasks sequentially to ensure all complete
  let completed = 0;
  
  function insertTask() {
    if (completed >= 20) {
      console.log('Successfully added 20 random tasks to the database');
      db.close();
      return;
    }

    db.run(
      'INSERT INTO tasks (title, description, status, due_date) VALUES (?, ?, ?, ?)',
      [
        getRandomElement(taskTitles),
        getRandomElement(taskDescriptions),
        getRandomElement(statuses),
        getRandomFutureDate()
      ],
      (err) => {
        if (err) {
          console.error('Error inserting task:', err);
          db.close();
          return;
        }
        completed++;
        insertTask();
      }
    );
  }

  insertTask();
});
