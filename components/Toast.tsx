"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'sms';
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (message: string, type?: Toast['type'], duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: Toast['type'] = 'info', duration = 4000) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, type, duration }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        onClick={() => removeToast(toast.id)}
                        className={`pointer-events-auto cursor-pointer rounded-2xl px-5 py-4 shadow-xl border backdrop-blur-md transition-all animate-slide-in
              ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : ''}
              ${toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : ''}
              ${toast.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800' : ''}
              ${toast.type === 'sms' ? 'bg-amber-50 border-amber-200 text-amber-800' : ''}
            `}
                    >
                        <div className="flex items-start gap-3">
                            <span className="text-xl flex-shrink-0 mt-0.5">
                                {toast.type === 'success' && '✅'}
                                {toast.type === 'error' && '❌'}
                                {toast.type === 'info' && 'ℹ️'}
                                {toast.type === 'sms' && '📱'}
                            </span>
                            <p className="text-sm font-medium leading-relaxed">{toast.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
