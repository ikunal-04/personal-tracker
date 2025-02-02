export interface Task {
  id: string;
  title: string;
  description: string;
  endDate: string;
  isDailyReset: boolean;
  isCompletedToday: boolean;
  completionHistory: { date: string; completed: boolean }[];
}

export type TaskFormData = Omit<Task, 'id' | 'isCompletedToday' | 'completionHistory'>;