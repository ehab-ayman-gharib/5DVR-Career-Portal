'use client';

import { Square, CheckSquare } from 'lucide-react';

export interface TaskItem {
  id: string;
  title: string;
  category?: string;
  isCompleted: boolean;
}

interface TaskListProps {
  tasks?: TaskItem[];
  onToggleTask?: (id: string) => void;
}

export function TaskList({
  tasks = [
    { id: '1', title: 'Practice system design interview', category: 'Interview Prep', isCompleted: false },
    { id: '2', title: 'Update CV with new project', category: 'CV Center', isCompleted: false },
    { id: '3', title: 'Practice mock interview (HR)', category: 'Interview Prep', isCompleted: false },
  ],
  onToggleTask,
}: TaskListProps) {
  return (
    <div className="bg-[#F5F4FE] border border-[#E4E0FF] rounded-3xl p-6 shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-extrabold text-[#1E1B4B]">Today's Tasks</h3>
        <button className="text-xs text-[#52528C] hover:text-[#1E1B4B] underline font-medium">Show more</button>
      </div>

      <div className="space-y-3.5 flex-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onToggleTask && onToggleTask(task.id)}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            {task.isCompleted ? (
              <CheckSquare className="h-5 w-5 text-[#6C5CE7] shrink-0" />
            ) : (
              <Square className="h-5 w-5 text-[#D1CEF7] group-hover:text-[#6C5CE7] transition-colors shrink-0" />
            )}
            <span
              className={`text-xs font-semibold ${
                task.isCompleted ? 'text-[#9A97C9] line-through' : 'text-[#1E1B4B]'
              }`}
            >
              {task.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
