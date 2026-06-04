import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { store, Priority, TaskStatus } from '../data/store';

const router = Router();
router.use(requireAuth);

const taskSchema = z.object({
  projectId: z.string(), title: z.string().min(3), description: z.string().default(''), assigneeId: z.string(),
  status: z.enum(['BACKLOG','TODO','IN_PROGRESS','CODE_REVIEW','TESTING','DONE']).default('TODO'),
  priority: z.enum(['LOW','MEDIUM','HIGH','CRITICAL']).default('MEDIUM'), dueDate: z.string()
});

router.get('/', (req, res) => {
  const { projectId, status } = req.query;
  let tasks = store.db.tasks;
  if (projectId) tasks = tasks.filter(t => t.projectId === projectId);
  if (status) tasks = tasks.filter(t => t.status === status);
  res.json(tasks);
});

router.post('/', (req, res, next) => {
  try {
    const body = taskSchema.parse(req.body);
    const task = { id: store.id(), ...body, createdAt: store.now() };
    store.db.tasks.push(task);
    store.db.notifications.push({ id: store.id(), userId: task.assigneeId, message: `New task assigned: ${task.title}`, read: false, createdAt: store.now() });
    store.addLog(req.user!.email, `Created task ${task.title}`);
    res.status(201).json(task);
  } catch (err) { next(err); }
});

router.patch('/:id/status', (req, res) => {
  const task = store.db.tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  task.status = req.body.status as TaskStatus;
  store.addLog(req.user!.email, `Updated task status to ${task.status}`);
  res.json(task);
});

export default router;
