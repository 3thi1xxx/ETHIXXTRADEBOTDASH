// A simple toast implementation inspired by react-hot-toast and shadcn/ui
import React from 'react';
import { create } from 'zustand';

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 5000;

type ToastType = 'success' | 'error' | 'default';

export interface Toast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  type?: ToastType;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
}

const store = create<ToastState>((set, get) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };
    
    set((state) => ({
      toasts: [newToast, ...state.toasts].slice(0, TOAST_LIMIT),
    }));

    setTimeout(() => {
        get().removeToast(id);
    }, TOAST_REMOVE_DELAY);

    return id;
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

export const useToast = () => {
    const state = store();
    return {
        ...state,
        toast: (props: Omit<Toast, 'id'>) => state.addToast(props),
    };
}
