import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { store } from '../data/store';

const router = Router();
router.use(requireAuth);

router.get('/overview', (_req, res) => {
  const tasks = store.db.tasks;
  const bugs = store.db.bugs;
  const completed = tasks.filter(t => t.status === 'DONE').length;
  const overdue = tasks.filter(t => t.status !== 'DONE' && new Date(t.dueDate) < new Date()).length;
  const statusCounts = tasks.reduce<Record<string, number>>((acc, t) => { acc[t.status] = (acc[t.status] || 0) + 1; return acc; }, {});
  const priorityCounts = tasks.reduce<Record<string, number>>((acc, t) => { acc[t.priority] = (acc[t.priority] || 0) + 1; return acc; }, {});
  const bugSeverityCounts = bugs.reduce<Record<string, number>>((acc, b) => { acc[b.severity] = (acc[b.severity] || 0) + 1; return acc; }, {});
  res.json({
    projects: store.db.projects.length,
    users: store.db.users.length,
    totalTasks: tasks.length,
    completedTasks: completed,
    completionRate: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
    overdueTasks: overdue,
    openBugs: bugs.filter(b => b.status !== 'RESOLVED').length,
    statusCounts,
    priorityCounts,
    bugSeverityCounts,
    recentActivity: store.db.activityLogs.slice(0, 8)
  });
});

export default router;
