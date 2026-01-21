"use client";

import { useState, useEffect } from "react";
import { Task } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Input, TextArea } from "./Input";
import { Button } from "./Button";
import { ModalPortal } from "./ModalPortal";
import { X } from "lucide-react";

interface TaskModalProps {
  isOpen: boolean;
  task?: Task;
  onClose: () => void;
  onSubmit: (data: { title: string; description?: string }) => Promise<void>;
}

export const TaskModal = ({
  isOpen,
  task,
  onClose,
  onSubmit,
}: TaskModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
    setErrors({});

    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [task, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!title.trim()) {
      setErrors({ title: "Title is required" });
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      onClose();
    } catch (error: any) {
      if (error.response?.data?.details) {
        setErrors(error.response.data.details);
      } else {
        setErrors({
          submit: error.message || "Failed to save task",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalPortal>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md max-h-[calc(100vh-2rem)]"
              style={{
                pointerEvents: "auto",
              }}
            >
              <div className="bg-gradient-to-br from-dark-700 to-dark-800 rounded-xl border border-dark-600 p-6 shadow-2xl overflow-y-auto max-h-[calc(100vh-2rem)]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {task ? "Edit Task" : "New Task"}
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-dark-500 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Task Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    error={errors.title}
                    placeholder="What needs to be done?"
                    disabled={isLoading}
                  />

                  <TextArea
                    label="Description (Optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    error={errors.description}
                    placeholder="Add more details..."
                    rows={4}
                    disabled={isLoading}
                  />

                  {errors.submit && (
                    <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                      {errors.submit}
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={onClose}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isLoading}
                      className="flex-1"
                    >
                      {task ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ModalPortal>
  );
};
