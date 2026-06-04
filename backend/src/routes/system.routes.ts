import { Router } from 'express';
import { store } from '../data/store';

const router = Router();
const startedAt = Date.now();

router.get('/health', (_req, res) => res.json({ status: 'ok', service: 'ai-devops-backend', uptimeSeconds: Math.round((Date.now() - startedAt) / 1000) }));
router.get('/metrics', (_req, res) => res.json({
  uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
  memory: process.memoryUsage(),
  data: { users: store.db.users.length, projects: store.db.projects.length, tasks: store.db.tasks.length, bugs: store.db.bugs.length }
}));

export default router;
