import { useState, useEffect } from "react";
import { X, Plus, Trash2, Check, Circle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface DailyTasksProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export function DailyTasks({ isOpen, onClose }: DailyTasksProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Load tasks
  useEffect(() => {
    const saved = localStorage.getItem('enablex_tasks');
    if (saved) {
      setTasks(JSON.parse(saved).map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt)
      })));
    }
  }, []);

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        completed: false,
        createdAt: new Date(),
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      localStorage.setItem('enablex_tasks', JSON.stringify(updatedTasks));
      setNewTaskTitle("");
    }
  };

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      // Log activity when completing a task
      const log = JSON.parse(localStorage.getItem('enablex_activity_log') || '[]');
      log.unshift({
        id: Date.now().toString(),
        type: 'task',
        title: task.title,
        timestamp: new Date().toISOString(),
        status: 'completed'
      });
      localStorage.setItem('enablex_activity_log', JSON.stringify(log.slice(0, 100)));
    }
    
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('enablex_tasks', JSON.stringify(updatedTasks));
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem('enablex_tasks', JSON.stringify(updatedTasks));
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Portal Content */}
      <div className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col" style={{ height: '844px' }}>
        
        {/* Header */}
        <header className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 px-6 pt-12 pb-8 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-white drop-shadow-lg" style={{ fontSize: '2rem', fontWeight: 800 }}>
                Daily Tasks
              </h1>
              <p className="text-white/95 mt-2 drop-shadow-md" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                {activeTasks.length} tasks pending
              </p>
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={onClose}
              className="rounded-full bg-white/20 hover:bg-white/30 text-white w-14 h-14 shadow-lg backdrop-blur-sm"
            >
              <X className="w-8 h-8" strokeWidth={3} />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth">
            {/* Add Task Section */}
            <div className="mb-6">
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5">
              <h2 className="text-emerald-900 mb-4">Add New Task</h2>
              <div className="flex gap-3">
                <Input
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTask()}
                  placeholder="What do you need to do?"
                  className="h-14 text-lg rounded-xl border-2 border-emerald-300 focus:border-emerald-500 flex-1"
                />
                <Button
                  onClick={addTask}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl px-6 h-14 shadow-md"
                >
                  <Plus className="w-6 h-6" strokeWidth={2.5} />
                </Button>
              </div>
            </div>
          </div>

            {/* Tasks List */}
            <div className="space-y-6 pb-4">
              {/* Active Tasks */}
              {activeTasks.length > 0 && (
                <div>
                  <h3 className="text-neutral-700 mb-3">To Do ({activeTasks.length})</h3>
                  <div className="space-y-3">
                    {activeTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-white border-2 border-emerald-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <button
                          onClick={() => toggleTask(task.id)}
                          className="flex-shrink-0 w-10 h-10 rounded-full border-3 border-emerald-500 flex items-center justify-center hover:bg-emerald-50 transition-colors"
                        >
                          <Circle className="w-6 h-6 text-emerald-500" strokeWidth={2.5} />
                        </button>
                        <p className="flex-1 text-neutral-800 text-lg leading-snug">
                          {task.title}
                        </p>
                        <Button
                          onClick={() => deleteTask(task.id)}
                          variant="ghost"
                          className="flex-shrink-0 h-10 w-10 p-0 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-6 h-6" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Tasks */}
              {completedTasks.length > 0 && (
                <div>
                  <h3 className="text-neutral-700 mb-3">Completed ({completedTasks.length})</h3>
                  <div className="space-y-3">
                    {completedTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-neutral-50 border-2 border-neutral-200 rounded-2xl p-5 flex items-center gap-4 opacity-75"
                      >
                        <button
                          onClick={() => toggleTask(task.id)}
                          className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 transition-colors"
                        >
                          <Check className="w-7 h-7 text-white" strokeWidth={3} />
                        </button>
                        <p className="flex-1 text-neutral-600 text-lg leading-snug line-through">
                          {task.title}
                        </p>
                        <Button
                          onClick={() => deleteTask(task.id)}
                          variant="ghost"
                          className="flex-shrink-0 h-10 w-10 p-0 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-6 h-6" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {tasks.length === 0 && (
                <div className="text-center py-12 text-neutral-400">
                  <Check className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">No tasks yet</p>
                  <p className="text-sm mt-2">Add your first task above</p>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <div className="bg-white border-t-2 border-neutral-100 px-6 py-6">
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-900">Progress Today</p>
                <p className="text-emerald-700 text-sm">
                  {completedTasks.length} of {tasks.length} completed
                </p>
              </div>
              <div className="text-3xl">
                {tasks.length > 0 
                  ? `${Math.round((completedTasks.length / tasks.length) * 100)}%` 
                  : '0%'}
              </div>
            </div>
          </div>
          <Button 
            onClick={onClose}
            className="w-full bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-2xl py-6 shadow-md"
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
