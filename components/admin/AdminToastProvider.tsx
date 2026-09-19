"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Toast = { id: number; type: "success" | "error"; message: string };

type ToastContextValue = {
  toastSuccess: (message: string) => void;
  toastError: (message: string) => void;
};

const AdminToastContext = createContext<ToastContextValue | null>(null);

export function AdminToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((type: Toast["type"], message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4000);
  }, []);

  const toastSuccess = useCallback((message: string) => push("success", message), [push]);
  const toastError = useCallback((message: string) => push("error", message), [push]);

  return (
    <AdminToastContext.Provider value={{ toastSuccess, toastError }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              className={cn(
                "pointer-events-auto flex items-center gap-2 rounded-lg border px-4 py-3 text-sm shadow-lg",
                t.type === "success"
                  ? "border-olive/40 bg-charcoal text-cream"
                  : "border-crimson/40 bg-charcoal text-cream"
              )}
              role="status"
            >
              {t.type === "success" ? (
                <CheckCircle2 className="size-5 text-olive" aria-hidden />
              ) : (
                <XCircle className="size-5 text-crimson" aria-hidden />
              )}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </AdminToastContext.Provider>
  );
}

export function useAdminToast() {
  const ctx = useContext(AdminToastContext);
  if (!ctx) {
    return {
      toastSuccess: (msg: string) => console.log(msg),
      toastError: (msg: string) => console.error(msg),
    };
  }
  return ctx;
}
