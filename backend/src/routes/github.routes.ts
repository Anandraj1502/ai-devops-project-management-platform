import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getGithubSummary } from '../services/github.service';

const router = Router();
router.use(requireAuth);

router.get('/:owner/:repo/summary', async (req, res, next) => {
  try { res.json(await getGithubSummary(req.params.owner, req.params.repo)); }
  catch (err) { next(err); }
});

export default router;
