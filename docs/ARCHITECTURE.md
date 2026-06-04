# Architecture

```text
React + TypeScript Frontend
        |
        v
Express API Layer
        |
        |-- Auth Module: JWT, bcrypt, RBAC
        |-- Project Module: projects, sprints, tasks
        |-- AI Module: sprint reports and risk summary
        |-- GitHub Module: repo commits, issues, PRs, actions
        |-- Analytics Module: project KPIs
        |-- System Module: health and metrics
        |
        v
In-memory seeded store for easy local run
```

## Production Upgrade Ideas

- Replace in-memory store with PostgreSQL and Prisma
- Add Redis + BullMQ for background jobs
- Add Socket.IO for real-time notifications
- Add Prometheus/Grafana for observability
- Add Cloudinary/S3 file uploads
- Add OAuth login with GitHub
