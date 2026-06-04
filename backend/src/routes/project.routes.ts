import { Router } from 'express';
import { z } from 'zod';
import { allowRoles, requireAuth } from '../middleware/auth';
import { store } from '../data/store';

const router = Router();
router.use(requireAuth);

const projectSchema = z.object({ name: z.string().min(3), description: z.string().min(5) });

router.get('/', (_req, res) => res.json(store.db.projects));
router.post('/', allowRoles('ADMIN', 'PROJECT_MANAGER'), (req, res, next) => {
  try {
    const body = projectSchema.parse(req.body);
    const project = { id: store.id(), ...body, ownerId: req.user!.id, status: 'ACTIVE' as const, createdAt: store.now() };
    store.db.projects.push(project);
    store.addLog(req.user!.email, `Created project ${project.name}`);
    res.status(201).json(project);
  } catch (err) { next(err); }
});

router.get('/:id', (req, res) => {
  const project = store.db.projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json({ ...project, tasks: store.db.tasks.filter(t => t.projectId === project.id), bugs: store.db.bugs.filter(b => b.projectId === project.id) });
});

export default router;
