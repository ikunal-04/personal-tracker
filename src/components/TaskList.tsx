import React from 'react';
import { CheckCircle, Circle, Trash2 } from 'lucide-react';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskList({ tasks, onToggleComplete, onDeleteTask }: TaskListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const daysRemaining = getDaysRemaining(task.endDate);
        const isExpired = daysRemaining < 0;

        return (
          <div
            key={task.id}
            className={`task-card ${isExpired ? 'opacity-50' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-100">{task.title}</h3>
                <p className="text-gray-400 mt-1">{task.description}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-400">
                    End Date: {formatDate(task.endDate)}
                  </p>
                  <p className="text-sm text-gray-400">
                    Days Remaining: {' '}
                    <span className={daysRemaining <= 3 ? 'text-red-400 font-semibold' : ''}>
                      {daysRemaining}
                    </span>
                  </p>
                  {task.isDailyReset && (
                    <p className="text-sm text-blue-400">Daily reset enabled</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onToggleComplete(task.id)}
                  className="text-gray-400 hover:text-green-400 transition-colors"
                  disabled={isExpired}
                >
                  {task.isCompletedToday ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}