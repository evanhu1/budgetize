import { useState } from "react";
import { TreeNode } from "./categoryTree/Tree";
import { useCategoryStore } from "@/stores/store";

export default function Navigator() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const categories = useCategoryStore((state) => state.categories);

  const toggleCategory = (categoryId: string) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(
        expandedCategories.filter((id) => id !== categoryId)
      );
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };

  const renderCategory = (category: TreeNode) => (
    <div key={category.id} className="space-y-2">
      <div
        className={`flex items-center justify-between rounded-md px-4 py-2 transition-colors hover:bg-muted ${
          expandedCategories.includes(category.id)
            ? "bg-primary text-primary-foreground"
            : "bg-background text-foreground"
        }`}
        onClick={() => toggleCategory(category.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            toggleCategory(category.id);
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-center gap-2">
          <ChevronDownIcon className="h-4 w-4 transition-transform" />
          <span className="font-medium">{category.name}</span>
        </div>
        {category.children.length > 0 && (
          <ChevronRightIcon className="h-4 w-4" />
        )}
      </div>
      {expandedCategories.includes(category.id) && (
        <div className="ml-4 space-y-2">
          {category.children.map((child) => renderCategory(child))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full space-y-4 bg-white">
      {categories.map((category) => renderCategory(category))}
    </div>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
