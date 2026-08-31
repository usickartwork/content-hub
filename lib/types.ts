export type ContentStatus = 'Idea' | 'Planned' | 'Production' | 'Editing' | 'Review' | 'Scheduled' | 'Published';
export type TaskStatus = 'Pending' | 'In Progress' | 'Done' | 'Blocked';
export type Priority = 'Low' | 'Medium' | 'High';

export interface ContentItem {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  platform: string;
  status: ContentStatus;
  created_by: string;
}

export interface TaskItem {
  id: string;
  content_id: string;
  jobdesk: string;
  assignee: string;
  task: string;
  deadline: string;
  status: TaskStatus;
  priority: Priority;
}