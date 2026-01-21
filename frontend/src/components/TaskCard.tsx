'use client';

import { Task } from '@/types';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { Trash2, CheckCircle2, Circle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onClick: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard = ({
  task,
  onToggle,
  onClick,
  onEdit,
  onDelete,
}: TaskCardProps) => {
  const isCompleted = task.status === 'COMPLETED';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-600 hover:border-primary-700/50 rounded-xl p-5 transition-all duration-300 hover:shadow-glow-purple"
    >
      <div className="flex items-start gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onToggle(task.id)}
          className="mt-1 text-primary-400 hover:text-primary-300 transition-colors flex-shrink-0"
        >
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-accent-emerald" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </motion.button>

        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onClick(task)}>
          <h3
            className={`text-lg font-semibold mb-1 transition-all ${
              isCompleted
                ? 'line-through text-dark-500'
                : 'text-white group-hover:text-primary-300'
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p
              className={`text-sm transition-all ${
                isCompleted ? 'text-dark-600' : 'text-dark-500'
              }`}
            >
              {task.description}
            </p>
          )}

          <div className="mt-3 flex items-center gap-2 text-xs text-dark-500">
            <span>
              {new Date(task.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(task)}
            className="px-3 py-1.5 text-sm rounded-lg bg-dark-600 hover:bg-primary-700/30 text-primary-300 transition-colors"
          >
            Edit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg hover:bg-red-600/20 text-red-400 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
