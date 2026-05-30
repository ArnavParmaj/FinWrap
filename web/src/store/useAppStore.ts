import { create } from 'zustand';

interface AppState {
  isSidebarOpen: boolean;
  activeMonth: string; // YYYY-MM
  searchQuery: string;
  toggleSidebar: () => void;
  setActiveMonth: (month: string) => void;
  setSearchQuery: (query: string) => void;
}

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const useAppStore = create<AppState>()((set) => ({
  isSidebarOpen: false,
  activeMonth: getCurrentMonth(),
  searchQuery: '',
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setActiveMonth: (month) => set({ activeMonth: month }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
