import { create } from "zustand";

const useUiStore = create((set) => ({
  // UI State
  isSidebarOpen: false,
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  // Error State
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

export default useUiStore;
