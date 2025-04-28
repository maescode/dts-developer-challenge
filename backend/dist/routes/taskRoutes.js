"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const database_1 = __importDefault(require("../db/database"));
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
// Create a task
router.post('/', validation_1.taskValidation, (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const task = req.body;
    const query = 'INSERT INTO tasks (title, description, status, due_date) VALUES (?, ?, ?, ?)';
    database_1.default.run(query, [task.title, task.description, task.status, task.due_date], function (err) {
        if (err) {
            res.status(500).json({ error: 'Error creating task' });
            return;
        }
        const newTask = {
            id: this.lastID,
            ...task,
            created_at: new Date().toISOString()
        };
        res.status(201).json(newTask);
    });
});
// Get all tasks
router.get('/', (req, res) => {
    const query = 'SELECT * FROM tasks ORDER BY created_at DESC';
    database_1.default.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Error retrieving tasks' });
            return;
        }
        res.json(rows);
    });
});
// Get single task by id
router.get('/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const query = 'SELECT * FROM tasks WHERE id = ?';
    database_1.default.get(query, [taskId], (err, row) => {
        if (err) {
            res.status(500).json({ error: 'Error retrieving task' });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        res.json(row);
    });
});
// Update a task
router.put('/:id', validation_1.taskValidation, (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const taskId = parseInt(req.params.id, 10);
    const task = req.body;
    const query = 'UPDATE tasks SET title = ?, description = ?, status = ?, due_date = ? WHERE id = ?';
    database_1.default.run(query, [task.title, task.description, task.status, task.due_date, taskId], function (err) {
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
        database_1.default.get(selectQuery, [taskId], (err, updatedTask) => {
            if (err || !updatedTask) {
                res.status(500).json({ error: 'Error retrieving updated task' });
                return;
            }
            res.json(updatedTask);
        });
    });
});
// Delete a task
router.delete('/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const query = 'DELETE FROM tasks WHERE id = ?';
    database_1.default.run(query, [taskId], function (err) {
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
exports.taskRoutes = router;
