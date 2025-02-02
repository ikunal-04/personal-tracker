import React, { useState, useEffect } from 'react';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { Task, TaskFormData } from './types';
import { Target } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Check and reset daily tasks at midnight
  useEffect(() => {
    const checkDate = () => {
      const today = new Date().toDateString();
      const lastChecked = localStorage.getItem('lastChecked');

      if (lastChecked !== today) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => ({
            ...task,
            isCompletedToday: false,
          }))
        );
        localStorage.setItem('lastChecked', today);
      }
    };

    checkDate();
    const interval = setInterval(checkDate, 1000 * 60); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const handleAddTask = (taskData: TaskFormData) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      isCompletedToday: false,
      completionHistory: [],
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const handleToggleComplete = (taskId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const newHistory = [
            ...task.completionHistory,
            { date: today, completed: !task.isCompletedToday },
          ];
          return {
            ...task,
            isCompletedToday: !task.isCompletedToday,
            completionHistory: newHistory,
          };
        }
        return task;
      })
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-center mb-8">
          <Target className="w-8 h-8 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-900">Goal Tracker</h1>
        </div>

        <TaskForm onSubmit={handleAddTask} />
        
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No goals added yet. Start by adding a new goal above!</p>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </div>
    </div>
  );
}

export default App;