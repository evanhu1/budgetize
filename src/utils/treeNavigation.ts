import { TreeNode } from "@/components/categoryTree/Tree";

export const findCategoryNode = (
  categories: TreeNode[],
  id: string
): TreeNode | undefined => {
  for (const category of categories) {
    if (category.id === id) {
      return category;
    }
    if (category.children.length > 0) {
      const found = findCategoryNode(category.children, id);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
};