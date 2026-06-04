import axios from 'axios';
import { env } from '../config/env';

const headers = env.githubToken ? { Authorization: `Bearer ${env.githubToken}` } : undefined;

export async function getGithubSummary(owner: string, repo: string) {
  const base = `https://api.github.com/repos/${owner}/${repo}`;
  const [repoRes, commitsRes, pullsRes, issuesRes, runsRes] = await Promise.allSettled([
    axios.get(base, { headers }),
    axios.get(`${base}/commits?per_page=5`, { headers }),
    axios.get(`${base}/pulls?state=open&per_page=5`, { headers }),
    axios.get(`${base}/issues?state=open&per_page=5`, { headers }),
    axios.get(`${base}/actions/runs?per_page=5`, { headers })
  ]);

  const safe = (result: PromiseSettledResult<any>, fallback: any) => result.status === 'fulfilled' ? result.value.data : fallback;
  return {
    repository: safe(repoRes, { full_name: `${owner}/${repo}`, description: 'Unavailable' }),
    latestCommits: safe(commitsRes, []).map((c: any) => ({ sha: c.sha?.slice(0, 7), message: c.commit?.message, author: c.commit?.author?.name })),
    openPullRequests: safe(pullsRes, []).map((p: any) => ({ title: p.title, url: p.html_url, user: p.user?.login })),
    openIssues: safe(issuesRes, []).filter((i: any) => !i.pull_request).map((i: any) => ({ title: i.title, url: i.html_url, user: i.user?.login })),
    workflowRuns: (safe(runsRes, { workflow_runs: [] }).workflow_runs || []).map((r: any) => ({ name: r.name, status: r.status, conclusion: r.conclusion, branch: r.head_branch }))
  };
}
