"use client"

import { useState, useCallback } from "react"
import { createContext, useContext } from "react"

interface ToastData {
  message: string
  type: "success" | "error"
}

const ToastContext = createContext<{
  show: (message: string, type?: "success" | "error") => void
}>({ show: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null)

  const show = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 animate-in fade-in slide-in-from-bottom-2 sm:max-w-sm">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white ${
              toast.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export const toast = {
  success: (message: string) => {
    const event = new CustomEvent("toast", { detail: { message, type: "success" } })
    window.dispatchEvent(event)
  },
  error: (message: string) => {
    const event = new CustomEvent("toast", { detail: { message, type: "error" } })
    window.dispatchEvent(event)
  },
}
