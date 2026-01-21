# Task Management API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication

All endpoints except `/auth/*` require an `Authorization` header with Bearer token:
```
Authorization: Bearer <accessToken>
```

## Error Responses

All error responses follow this format:
```json
{
  "message": "Error description",
  "statusCode": 400,
  "timestamp": "2025-01-21T10:00:00.000Z",
  "details": {}  // Optional
}
```

### Status Codes
- `200` - Success
- `201` - Created
- `204` - No Content (Success with no body)
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict
- `500` - Server Error

---

## Authentication Endpoints

### Register User
Create a new user account.

```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "userId": "clk123...",
  "email": "user@example.com",
  "name": "John Doe",
  "accessToken": "eyJhbGciOi..."
}
```

**Errors:**
- `400` - Invalid email, password < 6 chars, or missing fields
- `409` - Email already registered

**Note:** A refresh token is set as HTTP-only cookie automatically.

---

### Login User
Authenticate with email and password.

```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "userId": "clk123...",
  "email": "user@example.com",
  "name": "John Doe",
  "accessToken": "eyJhbGciOi..."
}
```

**Errors:**
- `400` - Missing email or password
- `401` - Invalid credentials

---

### Refresh Access Token
Get a new access token using the refresh token.

```
POST /auth/refresh
```

**Note:** Refresh token must be in cookies (set automatically by login/register).

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOi..."
}
```

**Errors:**
- `401` - Refresh token missing or expired

---

### Logout User
Invalidate the refresh token and logout.

```
POST /auth/logout
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## Task Endpoints

### List Tasks
Get all tasks for the current user with pagination, filtering, and search.

```
GET /tasks?page=1&limit=10&status=PENDING&search=meeting
Authorization: Bearer <accessToken>
```

**Query Parameters:**
- `page` (number, optional, default=1) - Page number for pagination
- `limit` (number, optional, default=10, max=100) - Items per page
- `status` (string, optional) - Filter by status: `PENDING` or `COMPLETED`
- `search` (string, optional) - Search in task titles (case-insensitive)

**Response (200):**
```json
{
  "data": [
    {
      "id": "task-id-123",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "status": "PENDING",
      "userId": "user-id-123",
      "createdAt": "2025-01-21T10:00:00.000Z",
      "updatedAt": "2025-01-21T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

**Errors:**
- `401` - Missing or invalid token

---

### Create Task
Create a new task for the current user.

```
POST /tasks
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"  // Optional
}
```

**Request Body:**
- `title` (string, required, 1-255 chars) - Task title
- `description` (string, optional, 0-5000 chars) - Task description

**Response (201):**
```json
{
  "id": "task-id-123",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "status": "PENDING",
  "userId": "user-id-123",
  "createdAt": "2025-01-21T10:00:00.000Z",
  "updatedAt": "2025-01-21T10:00:00.000Z"
}
```

**Errors:**
- `400` - Title is missing or invalid
- `401` - Missing or invalid token

---

### Get Task
Get a specific task by ID.

```
GET /tasks/:id
Authorization: Bearer <accessToken>
```

**URL Parameters:**
- `id` (string, required) - Task ID

**Response (200):**
```json
{
  "id": "task-id-123",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "status": "PENDING",
  "userId": "user-id-123",
  "createdAt": "2025-01-21T10:00:00.000Z",
  "updatedAt": "2025-01-21T10:00:00.000Z"
}
```

**Errors:**
- `401` - Missing or invalid token
- `404` - Task not found or doesn't belong to user

---

### Update Task
Update task details (title, description, status).

```
PATCH /tasks/:id
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "Buy vegetables",
  "description": "Carrots, broccoli",
  "status": "COMPLETED"
}
```

**URL Parameters:**
- `id` (string, required) - Task ID

**Request Body (all optional):**
- `title` (string) - New task title
- `description` (string) - New task description
- `status` (string) - `PENDING` or `COMPLETED`

**Response (200):**
```json
{
  "id": "task-id-123",
  "title": "Buy vegetables",
  "description": "Carrots, broccoli",
  "status": "COMPLETED",
  "userId": "user-id-123",
  "createdAt": "2025-01-21T10:00:00.000Z",
  "updatedAt": "2025-01-21T10:01:00.000Z"
}
```

**Errors:**
- `400` - Invalid data
- `401` - Missing or invalid token
- `404` - Task not found or doesn't belong to user

---

### Toggle Task Status
Toggle task status between PENDING and COMPLETED.

```
PATCH /tasks/:id/toggle
Authorization: Bearer <accessToken>
```

**URL Parameters:**
- `id` (string, required) - Task ID

**Response (200):**
```json
{
  "id": "task-id-123",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "status": "COMPLETED",
  "userId": "user-id-123",
  "createdAt": "2025-01-21T10:00:00.000Z",
  "updatedAt": "2025-01-21T10:01:00.000Z"
}
```

**Errors:**
- `401` - Missing or invalid token
- `404` - Task not found or doesn't belong to user

---

### Delete Task
Delete a task permanently.

```
DELETE /tasks/:id
Authorization: Bearer <accessToken>
```

**URL Parameters:**
- `id` (string, required) - Task ID

**Response (204):** No content

**Errors:**
- `401` - Missing or invalid token
- `404` - Task not found or doesn't belong to user

---

## Example cURL Commands

### Register
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

### Create Task
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My Task",
    "description": "Task details"
  }'
```

### List Tasks
```bash
curl http://localhost:3000/tasks?page=1&limit=10&status=PENDING \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Toggle Task
```bash
curl -X PATCH http://localhost:3000/tasks/TASK_ID/toggle \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Delete Task
```bash
curl -X DELETE http://localhost:3000/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Rate Limiting

Currently not implemented. Add rate limiting middleware for production.

## Pagination Guidelines

- Default page size: 10 items
- Maximum page size: 100 items
- Page numbering: 1-indexed
- Use `totalPages` to know when to stop paginating

---

## Data Validation Rules

### User Registration
- Email: Valid format (xxx@xxx.xxx)
- Password: Minimum 6 characters
- Name: Non-empty string

### Task Creation
- Title: Required, 1-255 characters
- Description: Optional, 0-5000 characters

### Task Status
- `PENDING` - Task not completed
- `COMPLETED` - Task finished

---

## Security Notes

1. **Tokens expire after 15 minutes** - Use refresh endpoint to get new token
2. **Passwords are hashed** - Using bcrypt with 12 salt rounds
3. **SQL Injection protected** - Using Prisma ORM parameterized queries
4. **CORS enabled** - Only for configured frontend URL
5. **HTTP-only cookies** - Refresh tokens stored securely

---

**Last Updated**: January 2025  
**API Version**: 1.0.0
