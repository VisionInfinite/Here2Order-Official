import { create } from 'zustand'

interface MenuState {
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
}

export const useMenuStore = create<MenuState>((set) => ({
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),
})) 