import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Role, store } from '../data/store';

declare global {
  namespace Express {
    interface Request { user?: { id: string; email: string; role: Role; name: string }; }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Missing token' });
  try {
    const payload = jwt.verify(header.replace('Bearer ', ''), env.jwtSecret) as { id: string };
    const user = store.db.users.find(u => u.id === payload.id);
    if (!user) return res.status(401).json({ message: 'Invalid token user' });
    req.user = { id: user.id, email: user.email, role: user.role, name: user.name };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function allowRoles(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden: insufficient role' });
    next();
  };
}
