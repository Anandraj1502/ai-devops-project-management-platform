# Cloud-Native AI DevOps & Project Management Platform

Advanced full-stack Software Engineer portfolio project: **React + TypeScript frontend**, **Node.js + Express backend**, JWT authentication, role-based access, project/task/bug tracking, AI sprint reports, GitHub integration, analytics dashboard, logging, tests, Docker files, and clean API documentation.

## Features

- JWT authentication with role-based access control
- Project, sprint, task, bug, comment, and notification modules
- AI sprint report generator with local fallback if no API key is provided
- GitHub repository integration: commits, pull requests, issues, workflow runs
- Analytics dashboard: task completion, overdue risk, bug priority, API health
- Structured logging, health endpoint, metrics endpoint
- Input validation using Zod
- Backend tests with Jest + Supertest
- Docker Compose setup for production-style deployment

## Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, Recharts, Axios  
**Backend:** Node.js, Express.js, TypeScript, JWT, bcryptjs, Zod, Winston  
**DevOps:** Docker, Docker Compose, GitHub Actions workflow  
**Testing:** Jest, Supertest

## How to Run Locally

### 1. Open terminal in this folder

```bash
cd ai-devops-project-management-platform
```

### 2. Install dependencies

```bash
npm run install:all
```

### 3. Create environment file

```bash
cp .env.example backend/.env
cp .env.example frontend/.env
```

On Windows PowerShell:

```powershell
copy .env.example backend\.env
copy .env.example frontend\.env
```

### 4. Start full project

```bash
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000/api/health

## Demo Login

```text
Email: admin@example.com
Password: Admin@123
```

## Optional API Keys

The project runs without API keys. If you add keys, extra live features become available.

```env
OPENAI_API_KEY=your_openai_key
GITHUB_TOKEN=your_github_token
```

If no OpenAI key is present, the AI report generator uses a professional local mock generator. If no GitHub token is present, public GitHub API calls still work with lower rate limits.

## Docker Run

```bash
docker compose up --build
```

Frontend container: http://localhost:5173  
Backend container: http://localhost:5000

## Important API Endpoints

```text
POST /api/auth/login
GET  /api/auth/me
GET  /api/projects
POST /api/projects
GET  /api/tasks
POST /api/tasks
GET  /api/analytics/overview
POST /api/ai/sprint-report
GET  /api/github/:owner/:repo/summary
GET  /api/health
GET  /api/metrics
```

## Resume Points

- Developed a cloud-native AI-powered DevOps and project management platform using React, TypeScript, Node.js, Express, JWT, and role-based access control.
- Built modules for project tracking, sprint planning, task assignment, bug management, notifications, analytics, and AI-generated reports.
- Integrated GitHub repository insights including commits, issues, pull requests, and workflow run status for real-time engineering visibility.
- Implemented secure authentication, input validation, structured logging, health checks, metrics endpoints, and API testing.
- Containerized the application with Docker and added GitHub Actions workflow for CI validation.

## Suggested GitHub Description

```text
A cloud-native AI-powered DevOps and project management platform with JWT auth, GitHub integration, analytics dashboard, AI reports, Docker, and testing.
```
