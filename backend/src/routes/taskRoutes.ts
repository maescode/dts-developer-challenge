import { Router, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Task, TaskInput } from '../models/task';
import db from '../db/database';
import { taskValidation, taskStatusValidation } from '../middleware/validation';

const router: Router = Router();

interface DatabaseRunResult {
  lastID: number;
  changes: number;
}

// Helper function to format dates consistently
function formatDateForResponse(task: Task): Task {
  const formattedTask = { ...task };
  try {
    if (task.due_date) {
      // Convert string to Date object and validate
      const date = new Date(task.due_date);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid due date format');
      }

      // Normalize the date by setting it to end of day UTC
      const normalizedDate = new Date(date);
      normalizedDate.setUTCHours(23, 59, 59, 999);
      formattedTask.due_date = normalizedDate.toISOString();
    }

    if (task.created_at) {
      // Convert string to Date object and validate
      const date = new Date(task.created_at);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid created_at date format');
      }
      formattedTask.created_at = date.toISOString();
    }
  } catch (error) {
    console.error('Error formatting dates:', error);
    throw new Error('Invalid date format in task');
  }
  return formattedTask;
}

// Create a task
router.post('/', taskValidation, (req: Request, res: Response): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const task: TaskInput = req.body;
  const query = 'INSERT INTO tasks (title, description, status, due_date) VALUES (?, ?, ?, ?)';
  
  db.run(query, [task.title, task.description, task.status, task.due_date], function(this: DatabaseRunResult, err: Error | null) {
    if (err) {
      res.status(500).json({ error: 'Error creating task' });
      return;
    }
    
    const newTask: Task = {
      id: this.lastID,
      ...task,
      created_at: new Date().toISOString()
    };
    res.status(201).json(formatDateForResponse(newTask));
  });
});

// Get all tasks
router.get('/', (req: Request, res: Response): void => {
  const query = 'SELECT * FROM tasks ORDER BY created_at DESC';
  
  db.all(query, [], (err: Error | null, rows: Task[]) => {
    if (err) {
      res.status(500).json({ error: 'Error retrieving tasks' });
      return;
    }
    // Format dates for all tasks
    const formattedTasks = rows.map(task => formatDateForResponse(task));
    res.json(formattedTasks);
  });
});

// Get single task by id
router.get('/:id', (req: Request, res: Response): void => {
  const taskId = parseInt(req.params.id, 10);
  const query = 'SELECT * FROM tasks WHERE id = ?';
  
  db.get(query, [taskId], (err: Error | null, row: Task | undefined) => {
    if (err) {
      res.status(500).json({ error: 'Error retrieving task' });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(formatDateForResponse(row));
  });
});

// Update a task
router.put('/:id', taskValidation, (req: Request, res: Response): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const taskId = parseInt(req.params.id, 10);
  const task: TaskInput = req.body;
  const query = 'UPDATE tasks SET title = ?, description = ?, status = ?, due_date = ? WHERE id = ?';
  
  db.run(query, [task.title, task.description, task.status, task.due_date, taskId], function(this: DatabaseRunResult, err: Error | null) {
    if (err) {
      res.status(500).json({ error: 'Error updating task' });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Fetch the updated task to return in response
    const selectQuery = 'SELECT * FROM tasks WHERE id = ?';
    db.get(selectQuery, [taskId], (err: Error | null, updatedTask: Task | undefined) => {
      if (err || !updatedTask) {
        res.status(500).json({ error: 'Error retrieving updated task' });
        return;
      }
      res.json(formatDateForResponse(updatedTask));
    });
  });
});

// Delete a task
router.delete('/:id', (req: Request, res: Response): void => {
  const taskId = parseInt(req.params.id, 10);
  const query = 'DELETE FROM tasks WHERE id = ?';
  
  db.run(query, [taskId], function(this: DatabaseRunResult, err: Error | null) {
    if (err) {
      res.status(500).json({ error: 'Error deleting task' });
      return;
    }

    if (this.changes === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.status(204).send();
  });
});

export const taskRoutes = router;
