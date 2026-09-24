import React, { createContext, useContext, useState, useEffect } from 'react';
import { Creator } from '../types/index.js';
import { fetchCreators, resetDemoData } from '../services/api.js';

export type UserRole = 'CREATOR' | 'CLIENT';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeCreator: Creator | null;
  setActiveCreator: (creator: Creator) => void;
  activeClientName: string;
  setActiveClientName: (name: string) => void;
  creators: Creator[];
  refreshCreators: () => Promise<void>;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  currentPath: string;
  navigate: (path: string) => void;
  preselectedCategory: string | null;
  setPreselectedCategory: (category: string | null) => void;
  handleResetDemoData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('CLIENT');
  const [creators, setCreators] = useState<Creator[]>([]);
  const [activeCreator, setActiveCreator] = useState<Creator | null>(null);
  const [activeClientName, setActiveClientName] = useState<string>('Alex Morgan');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [preselectedCategory, setPreselectedCategory] = useState<string | null>(null);

  const refreshCreators = async () => {
    try {
      const data = await fetchCreators();
      setCreators(data);
      if (!activeCreator && data.length > 0) {
        setActiveCreator(data[0]);
      }
    } catch {
      // Fallback silently if offline or initial load
    }
  };

  useEffect(() => {
    refreshCreators();

    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const addToast = ({ type, title, message }: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleResetDemoData = async () => {
    try {
      await resetDemoData();
      await refreshCreators();
      addToast({
        type: 'success',
        title: 'Demo Data Reset',
        message: 'All sample creators, gigs, and booking states restored to default.',
      });
      // Force page update
      window.dispatchEvent(new CustomEvent('demo-data-reset'));
    } catch {
      addToast({
        type: 'error',
        title: 'Reset Failed',
        message: 'Could not reset demo data. Please try again.',
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeCreator,
        setActiveCreator,
        activeClientName,
        setActiveClientName,
        creators,
        refreshCreators,
        toasts,
        addToast,
        removeToast,
        currentPath,
        navigate,
        preselectedCategory,
        setPreselectedCategory,
        handleResetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
