"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (options: Omit<ToastItem, "id">) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type, title, message, duration = 4000 }: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev.slice(-3), newToast]); // Limit to max 4 concurrent toasts

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, message?: string) => toast({ type: "success", title, message }),
    [toast]
  );

  const error = useCallback(
    (title: string, message?: string) => toast({ type: "error", title, message }),
    [toast]
  );

  const warning = useCallback(
    (title: string, message?: string) => toast({ type: "warning", title, message }),
    [toast]
  );

  const info = useCallback(
    (title: string, message?: string) => toast({ type: "info", title, message }),
    [toast]
  );

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-[#D94E34] shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-[#D97706] shrink-0" />;
      case "info":
      default:
        return <Info className="h-4 w-4 text-[#2563EB] shrink-0" />;
    }
  };

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      {/* Toast Render Container */}
      <div
        aria-live="polite"
        aria-label="Notification Center"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            role="status"
            className="pointer-events-auto rounded-2xl border border-[rgba(20,21,23,0.18)] bg-[#ECEBE5] p-4 shadow-lg text-[#141416] flex items-start justify-between gap-3 transition-all animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-lg bg-[#E6E5DF] mt-0.5 border border-[rgba(20,21,23,0.08)]">
                {getIcon(item.type)}
              </div>
              <div className="space-y-0.5">
                <h4 className="font-heading text-xs font-bold tracking-tight text-[#141416]">
                  {item.title}
                </h4>
                {item.message && (
                  <p className="font-sans text-[11px] text-[#57585C] leading-relaxed">
                    {item.message}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => removeToast(item.id)}
              aria-label="Dismiss notification"
              className="text-[#828387] hover:text-[#141416] transition-colors p-1 rounded-md focus-visible:ring-2 focus-visible:ring-[#D94E34] focus:outline-hidden"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
