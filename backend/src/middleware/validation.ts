import { body } from 'express-validator';

export const taskValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .trim()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be one of: pending, in-progress, completed'),
  
  body('due_date')
    .notEmpty()
    .withMessage('Due date is required')
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date')
    .custom((value) => {
      if (!value) {
        throw new Error('Due date is required');
      }

      try {
        const date = new Date(value);
        const now = new Date();
        
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date format');
        }

        // Compare dates ignoring time
        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (dateOnly < nowOnly) {
          throw new Error('Due date must be today or in the future');
        }

        return true;
      } catch (e) {
        throw new Error('Invalid date format');
      }
    })
];

export const taskStatusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .trim()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be one of: pending, in-progress, completed')
];
