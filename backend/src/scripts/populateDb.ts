import db from '../db/database';

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

const statuses: ('pending' | 'in-progress' | 'completed')[] = ['pending', 'in-progress', 'completed'];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomFutureDate(): string {
  const date = new Date();
  // Add random number of days (1-60) to current date
  date.setDate(date.getDate() + Math.floor(Math.random() * 60) + 1);
  return date.toISOString();
}

async function populateDatabase(): Promise<void> {
  const tasks = Array.from({ length: 20 }, (_, i) => ({
    title: getRandomElement(taskTitles),
    description: getRandomElement(taskDescriptions),
    status: getRandomElement(statuses),
    due_date: getRandomFutureDate()
  }));

  const insertPromises = tasks.map(task => {
    return new Promise<void>((resolve, reject) => {
      const query = 'INSERT INTO tasks (title, description, status, due_date) VALUES (?, ?, ?, ?)';
      db.run(query, [task.title, task.description, task.status, task.due_date], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });

  try {
    await Promise.all(insertPromises);
    console.log('Successfully added 20 random tasks to the database');
    db.close();
  } catch (error) {
    console.error('Error populating database:', error);
    db.close();
  }
}

// Run the population script
populateDatabase();
