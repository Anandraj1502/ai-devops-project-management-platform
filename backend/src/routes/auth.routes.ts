import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env';
import { requireAuth } from '../middleware/auth';
import { store } from '../data/store';

const router = Router();
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

router.post('/login', (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    const user = store.db.users.find(u => u.email.toLowerCase() === body.email.toLowerCase());
    if (!user || !bcrypt.compareSync(body.password, user.passwordHash)) return res.status(401).json({ message: 'Invalid email or password' });
    const token = jwt.sign({ id: user.id }, env.jwtSecret, { expiresIn: '1d' });
    store.addLog(user.email, 'Logged in');
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
});

router.get('/me', requireAuth, (req, res) => res.json({ user: req.user }));
export default router;
