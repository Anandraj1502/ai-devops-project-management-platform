# API Documentation

## Auth

### POST /api/auth/login
Request:
```json
{ "email": "admin@example.com", "password": "Admin@123" }
```

### GET /api/auth/me
Header:
```text
Authorization: Bearer <token>
```

## Projects

### GET /api/projects
Returns all projects.

### POST /api/projects
Admin or Project Manager only.
```json
{ "name": "New Platform", "description": "Project description" }
```

## Tasks

### GET /api/tasks
Optional query: `projectId`, `status`.

### POST /api/tasks
```json
{
  "projectId": "project_id",
  "title": "Build API Gateway",
  "description": "Create route layer",
  "assigneeId": "user_id",
  "priority": "HIGH",
  "status": "TODO",
  "dueDate": "2026-06-20"
}
```

## Analytics

### GET /api/analytics/overview
Returns project, task, bug, completion, and activity metrics.

## AI

### POST /api/ai/sprint-report
```json
{ "projectId": "project_id" }
```

## GitHub

### GET /api/github/:owner/:repo/summary
Example:
```text
/api/github/facebook/react/summary
```
