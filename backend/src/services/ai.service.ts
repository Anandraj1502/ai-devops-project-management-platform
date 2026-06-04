import axios from 'axios';
import { env } from '../config/env';
import { store } from '../data/store';

export async function generateSprintReport(projectId: string) {
  const project = store.db.projects.find(p => p.id === projectId);
  if (!project) throw new Error('Project not found');
  const tasks = store.db.tasks.filter(t => t.projectId === projectId);
  const bugs = store.db.bugs.filter(b => b.projectId === projectId);
  const done = tasks.filter(t => t.status === 'DONE').length;
  const overdue = tasks.filter(t => t.status !== 'DONE' && new Date(t.dueDate) < new Date()).length;
  const summaryInput = { project: project.name, totalTasks: tasks.length, done, overdue, bugs: bugs.length };

  if (!env.openAiApiKey) {
    return {
      mode: 'local-fallback',
      title: `AI Sprint Report - ${project.name}`,
      executiveSummary: `${project.name} has completed ${done}/${tasks.length} tasks. ${overdue} tasks are overdue and ${bugs.length} bugs need tracking. Focus next on critical/high-priority unfinished tasks and build stability.`,
      risks: overdue > 0 ? ['Overdue delivery risk', 'Potential sprint spillover'] : ['No major schedule risk detected'],
      recommendations: ['Prioritize critical tasks', 'Review open bugs daily', 'Check GitHub workflow failures before release']
    };
  }

  const prompt = `Create a professional sprint report for this software project: ${JSON.stringify(summaryInput)}`;
  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }]
  }, { headers: { Authorization: `Bearer ${env.openAiApiKey}` } });

  return { mode: 'openai', report: response.data.choices?.[0]?.message?.content };
}
