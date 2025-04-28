# Task Management API Documentation

This document provides documentation for the Task Management API endpoints.

## Base URL
`http://localhost:3000/api/tasks`

## Endpoints

### Create a Task
- **Method**: POST
- **Endpoint**: `/`
- **Body**:
```json
{
  "title": "string",
  "description": "string",
  "status": "string",
  "due_date": "string (ISO 8601 format)"
}
```
- **Response**: 
  - Status: 201 Created
  - Returns the created task with ID and creation timestamp

### Get All Tasks
- **Method**: GET
- **Endpoint**: `/`
- **Response**: 
  - Status: 200 OK
  - Returns an array of tasks ordered by creation date (descending)

### Get Single Task
- **Method**: GET
- **Endpoint**: `/:id`
- **Parameters**: 
  - `id`: Task ID (number)
- **Response**: 
  - Status: 200 OK
  - Returns the requested task
  - 404 if task not found

### Update Task
- **Method**: PUT
- **Endpoint**: `/:id`
- **Parameters**: 
  - `id`: Task ID (number)
- **Body**:
```json
{
  "title": "string",
  "description": "string",
  "status": "string",
  "due_date": "string (ISO 8601 format)"
}
```
- **Response**: 
  - Status: 200 OK
  - Returns the updated task
  - 404 if task not found

### Delete Task
- **Method**: DELETE
- **Endpoint**: `/:id`
- **Parameters**: 
  - `id`: Task ID (number)
- **Response**: 
  - Status: 204 No Content
  - 404 if task not found

## Error Responses
All endpoints may return the following error responses:
- `400 Bad Request`: Invalid input data
- `404 Not Found`: Requested resource not found
- `500 Internal Server Error`: Server-side error

## Date Formats
- All dates (due_date, created_at) are returned in ISO 8601 format
- Due dates are normalized to end of day UTC (23:59:59.999)
