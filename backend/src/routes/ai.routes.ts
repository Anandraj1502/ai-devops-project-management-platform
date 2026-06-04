import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { generateSprintReport } from '../services/ai.service';

const router = Router();
router.use(requireAuth);

router.post('/sprint-report', async (req, res, next) => {
  try {
    const { projectId } = z.object({ projectId: z.string() }).parse(req.body);
    const report = await generateSprintReport(projectId);
    res.json(report);
  } catch (err) { next(err); }
});

export default router;
