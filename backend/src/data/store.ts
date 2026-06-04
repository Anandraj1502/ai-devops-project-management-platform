import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

export type Role = 'ADMIN' | 'PROJECT_MANAGER' | 'DEVELOPER' | 'TESTER' | 'VIEWER';
export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'CODE_REVIEW' | 'TESTING' | 'DONE';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface User { id: string; name: string; email: string; passwordHash: string; role: Role; }
export interface Project { id: string; name: string; description: string; ownerId: string; status: 'ACTIVE' | 'PAUSED' | 'COMPLETED'; createdAt: string; }
export interface Sprint { id: string; projectId: string; name: string; startDate: string; endDate: string; goal: string; }
export interface Task { id: string; projectId: string; sprintId?: string; title: string; description: string; assigneeId: string; status: TaskStatus; priority: Priority; dueDate: string; createdAt: string; }
export interface Bug { id: string; projectId: string; title: string; severity: Priority; status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'; createdAt: string; }
export interface Notification { id: string; userId: string; message: string; read: boolean; createdAt: string; }
export interface ActivityLog { id: string; actor: string; action: string; createdAt: string; }

export interface Db {
  users: User[]; projects: Project[]; sprints: Sprint[]; tasks: Task[]; bugs: Bug[]; notifications: Notification[]; activityLogs: ActivityLog[];
}

const dbPath = path.join(__dirname, 'app-db.json');
const now = () => new Date().toISOString();

function seed(): Db {
  const adminId = nanoid();
  const devId = nanoid();
  const projectId = nanoid();
  const sprintId = nanoid();
  const passwordHash = bcrypt.hashSync('Admin@123', 10);
  return {
    users: [
      { id: adminId, name: 'Anand Raj', email: 'admin@example.com', passwordHash, role: 'ADMIN' },
      { id: devId, name: 'Demo Developer', email: 'developer@example.com', passwordHash, role: 'DEVELOPER' }
    ],
    projects: [{ id: projectId, name: 'AI DevOps Platform', description: 'Advanced software engineering project with AI, analytics and GitHub insights.', ownerId: adminId, status: 'ACTIVE', createdAt: now() }],
    sprints: [{ id: sprintId, projectId, name: 'Sprint 1', startDate: '2026-06-01', endDate: '2026-06-14', goal: 'Build MVP with auth, task tracking and analytics.' }],
    tasks: [
      { id: nanoid(), projectId, sprintId, title: 'Design authentication service', description: 'JWT login, password hashing and RBAC.', assigneeId: adminId, status: 'DONE', priority: 'HIGH', dueDate: '2026-06-05', createdAt: now() },
      { id: nanoid(), projectId, sprintId, title: 'Integrate GitHub API', description: 'Fetch commits, pull requests and workflow runs.', assigneeId: devId, status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '2026-06-10', createdAt: now() },
      { id: nanoid(), projectId, sprintId, title: 'Build AI report generator', description: 'Generate sprint summary and risk analysis.', assigneeId: adminId, status: 'TODO', priority: 'CRITICAL', dueDate: '2026-06-12', createdAt: now() }
    ],
    bugs: [
      { id: nanoid(), projectId, title: 'Dashboard chart refresh issue', severity: 'MEDIUM', status: 'OPEN', createdAt: now() },
      { id: nanoid(), projectId, title: 'Token expiry handling improvement', severity: 'HIGH', status: 'IN_PROGRESS', createdAt: now() }
    ],
    notifications: [{ id: nanoid(), userId: adminId, message: 'Welcome! Your advanced project is ready.', read: false, createdAt: now() }],
    activityLogs: [{ id: nanoid(), actor: 'system', action: 'Seeded demo workspace', createdAt: now() }]
  };
}

let db: Db = seed();

export const store = {
  db,
  save() {},
  addLog(actor: string, action: string) { db.activityLogs.unshift({ id: nanoid(), actor, action, createdAt: now() }); },
  id: () => nanoid(),
  now
};
