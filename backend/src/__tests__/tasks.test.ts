import request from 'supertest';
import { app } from '../app';

describe('Task API', () => {
  const testTask = {
    title: 'Test Task',
    description: 'Test Description',
    status: 'pending',
    due_date: '2025-12-31T23:59:59.999Z'
  };

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send(testTask);
      
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        ...testTask,
        created_at: expect.any(String)
      });
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/tasks', () => {
    it('should return all tasks', async () => {
      // Create a task first
      await request(app)
        .post('/api/tasks')
        .send(testTask);

      const response = await request(app)
        .get('/api/tasks');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toMatchObject({
        id: expect.any(Number),
        ...testTask,
        created_at: expect.any(String)
      });
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return a single task', async () => {
      // Create a task first
      const createResponse = await request(app)
        .post('/api/tasks')
        .send(testTask);
      
      const taskId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/tasks/${taskId}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: taskId,
        ...testTask,
        created_at: expect.any(String)
      });
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .get('/api/tasks/99999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Task not found');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update an existing task', async () => {
      // Create a task first
      const createResponse = await request(app)
        .post('/api/tasks')
        .send(testTask);
      
      const taskId = createResponse.body.id;

      const updatedTask = {
        title: 'Updated Test Task',
        description: 'Updated Test Description',
        status: 'completed',
        due_date: '2025-12-31T23:59:59.999Z'
      };

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send(updatedTask);
      
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: taskId,
        ...updatedTask,
        created_at: expect.any(String)
      });
    });

    it('should validate required fields for update', async () => {
      const createResponse = await request(app)
        .post('/api/tasks')
        .send(testTask);
      
      const taskId = createResponse.body.id;

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should return 404 for updating non-existent task', async () => {
      const updatedTask = {
        title: 'Updated Test Task',
        description: 'Updated Test Description',
        status: 'completed',
        due_date: '2025-12-31T23:59:59.999Z'
      };

      const response = await request(app)
        .put('/api/tasks/99999')
        .send(updatedTask);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Task not found');
    });
  });
});
