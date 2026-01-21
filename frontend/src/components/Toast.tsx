"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

interface ToastOptions {
  id?: string;
  duration?: number;
}

let toastId = 0;
const toastEmitter = typeof window !== "undefined" ? new EventTarget() : null;

// Track active toasts to prevent duplicates
const activeToastMap = new Map<string, NodeJS.Timeout>();

export const useToast = () => {
  return {
    success: (message: string, options: ToastOptions = {}) => {
      const id = options.id || `toast-${++toastId}`;
      const duration = options.duration ?? 3000;

      // For success, ALWAYS dismiss any related error toast
      // Extract base ID (e.g., "load-tasks" from "load-tasks-error")
      const baseId = id.replace("-success", "").replace("-error", "");
      const relatedErrorId = `${baseId}-error`;
      
      // Dismiss the related error toast explicitly
      if (activeToastMap.has(relatedErrorId)) {
        clearTimeout(activeToastMap.get(relatedErrorId)!);
        activeToastMap.delete(relatedErrorId);
        // Dispatch dismiss event to remove from UI immediately
        const dismissEvent = new CustomEvent("dismissToast", {
          detail: { id: relatedErrorId },
        });
        toastEmitter?.dispatchEvent(dismissEvent);
      }

      const event = new CustomEvent("showToast", {
        detail: { id, message, type: "success", duration },
      });
      toastEmitter?.dispatchEvent(event);

      // Set auto-dismiss timeout
      if (duration !== Infinity) {
        const timeout = setTimeout(() => {
          activeToastMap.delete(id);
        }, duration);
        activeToastMap.set(id, timeout);
      }
    },

    error: (message: string, options: ToastOptions = {}) => {
      const id = options.id || `toast-${++toastId}`;
      const duration = options.duration ?? 5000; // Longer duration for errors

      // Prevent duplicate error toasts with the same ID
      if (id && activeToastMap.has(id)) {
        // Toast with this ID already exists, don't create a duplicate
        return;
      }

      const event = new CustomEvent("showToast", {
        detail: { id, message, type: "error", duration },
      });
      toastEmitter?.dispatchEvent(event);

      // Set auto-dismiss timeout
      if (duration !== Infinity) {
        const timeout = setTimeout(() => {
          activeToastMap.delete(id);
        }, duration);
        activeToastMap.set(id, timeout);
      }
    },

    info: (message: string, options: ToastOptions = {}) => {
      const id = options.id || `toast-${++toastId}`;
      const duration = options.duration ?? 3000;

      const event = new CustomEvent("showToast", {
        detail: { id, message, type: "info", duration },
      });
      toastEmitter?.dispatchEvent(event);

      // Set auto-dismiss timeout
      if (duration !== Infinity) {
        const timeout = setTimeout(() => {
          activeToastMap.delete(id);
        }, duration);
        activeToastMap.set(id, timeout);
      }
    },

    dismiss: (id: string) => {
      // Clear any pending timeout for this toast
      if (activeToastMap.has(id)) {
        clearTimeout(activeToastMap.get(id)!);
        activeToastMap.delete(id);
      }

      const event = new CustomEvent("dismissToast", {
        detail: { id },
      });
      toastEmitter?.dispatchEvent(event);
    },
  };
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleShowToast = (event: Event) => {
      const customEvent = event as CustomEvent;
      const toast = customEvent.detail as ToastMessage;

      // Add or replace toast with same ID (prevents duplicates)
      setToasts((prev) => {
        const filtered = prev.filter((t) => t.id !== toast.id);
        return [...filtered, toast];
      });
    };

    const handleDismissToast = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { id } = customEvent.detail as { id: string };

      // Remove toast from display
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    toastEmitter?.addEventListener("showToast", handleShowToast);
    toastEmitter?.addEventListener("dismissToast", handleDismissToast);

    return () => {
      toastEmitter?.removeEventListener("showToast", handleShowToast);
      toastEmitter?.removeEventListener("dismissToast", handleDismissToast);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, x: 100 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-auto"
          >
            <div
              className={`px-4 py-3 rounded-lg font-medium text-sm shadow-lg ${
                toast.type === "success"
                  ? "bg-accent-emerald/90 text-white"
                  : toast.type === "error"
                    ? "bg-red-500/90 text-white"
                    : "bg-accent-cyan/90 text-white"
              }`}
            >
              {toast.message}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
