import * as React from "react";

interface ToastContextType {
    toast: (props: { title: string; description?: string }) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const toast = ({ title, description }: { title: string; description?: string }) => {
        // Simple toast implementation - you can enhance this
        const toastEl = document.createElement('div')
        toastEl.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50'
        toastEl.innerHTML = `
      <div class="font-medium">${title}</div>
      ${description ? `<div class="text-sm opacity-90">${description}</div>` : ''}
    `
        document.body.appendChild(toastEl)

        setTimeout(() => {
            document.body.removeChild(toastEl)
        }, 3000)
    }

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = React.useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}
