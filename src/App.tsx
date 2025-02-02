import { useState, useEffect } from 'react';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { Task, TaskFormData } from './types';
import { Target, PlusCircle } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

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
        
        // Send notifications for daily tasks
        if ('Notification' in window && Notification.permission === 'granted') {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          
          tasks.forEach((task: Task) => {
            if (task.isDailyReset) {
              new Notification('Daily Goal Reminder', {
                body: `Don't forget to complete your goal: ${task.title}`,
                icon: 'https://cdn-icons-png.flaticon.com/512/1584/1584892.png'
              });
              audio.play().catch(console.error);
            }
          });
        }
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
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setIsFormOpen(true)}
            className="btn-primary"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Create Goal
          </button>

          <div className="flex items-center">
            <Target className="w-8 h-8 text-blue-400 mr-2" />
            <h1 className="text-3xl font-bold text-gray-100">Goal Tracker</h1>
          </div>
        </div>

        <TaskForm 
          onSubmit={handleAddTask}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
        />
        
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No goals added yet. Start by adding a new goal!</p>
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