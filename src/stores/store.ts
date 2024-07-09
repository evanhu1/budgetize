import { create } from 'zustand';
import { TreeNode } from '@/components/categoryTree/Tree';

interface CategoryStore {
  categories: TreeNode[];
  setCategories: (categories: TreeNode[]) => void;
  addCategory: (parentId: string | null, newCategory: TreeNode) => void;
  removeCategory: (id: string) => void;
  updateCategory: (id: string, newName: string) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  setCategories: (categories) => set({ categories }),
  addCategory: (parentId, newCategory) =>
    set((state) => {
      const addToChildren = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map((node) => {
          if (node.id === parentId) {
            return { ...node, children: [...node.children, newCategory] };
          }
          if (node.children.length > 0) {
            return { ...node, children: addToChildren(node.children) };
          }
          return node;
        });
      };

      if (parentId === null) {
        return { categories: [...state.categories, newCategory] };
      }
      return { categories: addToChildren(state.categories) };
    }),
  removeCategory: (id) =>
    set((state) => {
      const removeFromChildren = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.filter((node) => node.id !== id).map((node) => ({
          ...node,
          children: removeFromChildren(node.children),
        }));
      };
      return { categories: removeFromChildren(state.categories) };
    }),
  updateCategory: (id, newName) =>
    set((state) => {
      const updateInChildren = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map((node) => {
          if (node.id === id) {
            return { ...node, name: newName };
          }
          if (node.children.length > 0) {
            return { ...node, children: updateInChildren(node.children) };
          }
          return node;
        });
      };
      return { categories: updateInChildren(state.categories) };
    }),
}));
