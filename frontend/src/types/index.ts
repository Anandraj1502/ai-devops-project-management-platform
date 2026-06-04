export interface User { id: string; name: string; email: string; role: string }
export interface Project { id: string; name: string; description: string; status: string; createdAt: string }
export interface Task { id: string; title: string; status: string; priority: string; dueDate: string; assigneeId: string }
export interface Analytics { projects:number; users:number; totalTasks:number; completedTasks:number; completionRate:number; overdueTasks:number; openBugs:number; statusCounts:Record<string,number>; priorityCounts:Record<string,number>; bugSeverityCounts:Record<string,number>; recentActivity:{id:string;actor:string;action:string;createdAt:string}[] }
