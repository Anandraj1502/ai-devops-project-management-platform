import { useEffect, useState } from 'react';
import { api } from './services/api';
import type { Analytics, Project, Task, User } from './types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Bot, Github, ShieldCheck, Target, Users } from 'lucide-react';
import './index.css';

function Login({ onLogin }: { onLogin: (u: User) => void }) {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      onLogin(res.data.user);
    } catch { setError('Login failed. Use demo credentials.'); }
  }
  return <div className="min-h-screen flex items-center justify-center p-6">
    <form onSubmit={submit} className="card max-w-md w-full space-y-4">
      <div className="flex items-center gap-3"><ShieldCheck className="text-blue-400" /><h1 className="text-2xl font-bold">AI DevOps Platform</h1></div>
      <p className="text-slate-400">Advanced Software Engineer portfolio project with auth, analytics, AI reports, and GitHub integration.</p>
      <input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      {error && <p className="text-red-400">{error}</p>}
      <button className="btn w-full">Login</button>
      <p className="text-xs text-slate-500">Demo: admin@example.com / Admin@123</p>
    </form>
  </div>
}

function Stat({ label, value, icon }: { label:string; value:string|number; icon:React.ReactNode }) {
  return <div className="card"><div className="flex items-center justify-between"><div><p className="text-slate-400 text-sm">{label}</p><p className="text-3xl font-bold mt-2">{value}</p></div><div className="text-blue-400">{icon}</div></div></div>
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [report, setReport] = useState<any>(null);
  const [github, setGithub] = useState<any>(null);
  const [repoInput, setRepoInput] = useState('facebook/react');

  async function load() {
    const [a,p,t] = await Promise.all([api.get('/analytics/overview'), api.get('/projects'), api.get('/tasks')]);
    setAnalytics(a.data); setProjects(p.data); setTasks(t.data);
  }
  useEffect(() => { const token = localStorage.getItem('token'); if (token) api.get('/auth/me').then(r => { setUser(r.data.user); load(); }).catch(()=>localStorage.removeItem('token')); }, []);
  if (!user) return <Login onLogin={(u)=>{setUser(u); load();}} />;

  const statusData = analytics ? Object.entries(analytics.statusCounts).map(([name,value]) => ({ name, value })) : [];
  const priorityData = analytics ? Object.entries(analytics.priorityCounts).map(([name,value]) => ({ name, value })) : [];

  async function generateReport() {
    const projectId = projects[0]?.id;
    if (!projectId) return;
    const res = await api.post('/ai/sprint-report', { projectId });
    setReport(res.data);
  }
  async function loadGithub() {
    const [owner, repo] = repoInput.split('/');
    const res = await api.get(`/github/${owner}/${repo}/summary`);
    setGithub(res.data);
  }

  return <main className="min-h-screen p-6 max-w-7xl mx-auto space-y-6">
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div><h1 className="text-3xl font-bold">Cloud-Native AI DevOps Dashboard</h1><p className="text-slate-400">Welcome, {user.name} • Role: {user.role}</p></div>
      <button className="btn bg-slate-700" onClick={()=>{localStorage.removeItem('token'); location.reload();}}>Logout</button>
    </header>

    {analytics && <section className="grid md:grid-cols-5 gap-4">
      <Stat label="Projects" value={analytics.projects} icon={<Target />} />
      <Stat label="Users" value={analytics.users} icon={<Users />} />
      <Stat label="Completion" value={`${analytics.completionRate}%`} icon={<Activity />} />
      <Stat label="Overdue" value={analytics.overdueTasks} icon={<Activity />} />
      <Stat label="Open Bugs" value={analytics.openBugs} icon={<ShieldCheck />} />
    </section>}

    <section className="grid lg:grid-cols-2 gap-6">
      <div className="card"><h2 className="text-xl font-semibold mb-4">Task Status Analytics</h2><div className="h-72"><ResponsiveContainer><BarChart data={statusData}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" /></BarChart></ResponsiveContainer></div></div>
      <div className="card"><h2 className="text-xl font-semibold mb-4">Task Priority Distribution</h2><div className="h-72"><ResponsiveContainer><PieChart><Pie data={priorityData} dataKey="value" nameKey="name" label>{priorityData.map((_,i)=><Cell key={i} />)}</Pie></PieChart></ResponsiveContainer></div></div>
    </section>

    <section className="grid lg:grid-cols-2 gap-6">
      <div className="card space-y-4"><div className="flex items-center gap-2"><Bot className="text-blue-400" /><h2 className="text-xl font-semibold">AI Sprint Report</h2></div><button onClick={generateReport} className="btn">Generate AI Report</button>{report && <pre className="bg-slate-950 p-4 rounded-xl overflow-auto text-sm whitespace-pre-wrap">{JSON.stringify(report, null, 2)}</pre>}</div>
      <div className="card space-y-4"><div className="flex items-center gap-2"><Github className="text-blue-400" /><h2 className="text-xl font-semibold">GitHub Repository Insights</h2></div><input className="input" value={repoInput} onChange={e=>setRepoInput(e.target.value)} placeholder="owner/repo" /><button onClick={loadGithub} className="btn">Load GitHub Summary</button>{github && <pre className="bg-slate-950 p-4 rounded-xl overflow-auto text-sm max-h-80">{JSON.stringify(github, null, 2)}</pre>}</div>
    </section>

    <section className="grid lg:grid-cols-2 gap-6">
      <div className="card"><h2 className="text-xl font-semibold mb-4">Projects</h2>{projects.map(p=><div key={p.id} className="border-b border-slate-700 py-3"><p className="font-semibold">{p.name}</p><p className="text-slate-400 text-sm">{p.description}</p></div>)}</div>
      <div className="card"><h2 className="text-xl font-semibold mb-4">Tasks</h2>{tasks.map(t=><div key={t.id} className="border-b border-slate-700 py-3 flex justify-between gap-4"><div><p className="font-semibold">{t.title}</p><p className="text-slate-400 text-sm">Due: {t.dueDate}</p></div><span className="text-xs h-fit px-2 py-1 bg-slate-800 rounded-lg">{t.status} • {t.priority}</span></div>)}</div>
    </section>
  </main>
}
