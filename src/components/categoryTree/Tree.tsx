"use client";
import { useState } from "react";

export interface TreeNode {
  id: string;
  name: string;
  children: TreeNode[];
}

export const useTreeData = (initialData: TreeNode[]) => {
  const [treeData, setTreeData] = useState<TreeNode[]>(initialData);

  const updateNode = (id: string, updateFn: (node: TreeNode) => TreeNode) => {
    const updateNodeRecursive = (nodes: TreeNode[]): TreeNode[] =>
      nodes.map((node) =>
        node.id === id
          ? updateFn(node)
          : { ...node, children: updateNodeRecursive(node.children) }
      );

    setTreeData(updateNodeRecursive);
  };

  const addChildNode = (parentId: string | null, newNodeName: string) => {
    if (parentId === null) {
      // Add a new top-level node
      setTreeData([
        ...treeData,
        {
          id: `root-${treeData.length}`,
          name: newNodeName,
          children: [],
        },
      ]);
    } else {
      // Add a child node
      updateNode(parentId, (node) => ({
        ...node,
        children: [
          ...node.children,
          {
            id: `${parentId}-${node.children.length}`,
            name: newNodeName,
            children: [],
          },
        ],
      }));
    }
  };

  const removeNode = (nodeId: string) => {
    setTreeData((prevData) => prevData.filter((node) => node.id !== nodeId));
  };

  const removeChildNode = (parentId: string | null, childId: string) => {
    if (parentId === null) {
      removeNode(childId);
    } else {
      updateNode(parentId, (node) => ({
        ...node,
        children: node.children.filter((child) => child.id !== childId),
      }));
    }
  };

  const updateNodeName = (nodeId: string, newName: string) => {
    updateNode(nodeId, (node) => ({ ...node, name: newName }));
  };

  return { treeData, addChildNode, removeChildNode, updateNodeName };
};

export const TreeNode: React.FC<{
  node: TreeNode;
  onAdd: (id: string | null, newNodeName: string) => void;
  onRemove: (parentId: string | null, childId: string) => void;
  onUpdate: (id: string, name: string) => void;
  depth: number;
  parentId: string | null;
}> = ({ node, onAdd, onRemove, onUpdate, depth, parentId }) => (
  <div className="grid gap-2">
    <div className="flex items-center justify-between bg-card rounded-md p-3 border border-muted">
      <input
        type="text"
        defaultValue={node.name}
        onBlur={(e) => onUpdate(node.id, e.target.value)}
        className="font-medium bg-transparent border-none focus:ring-0 flex-grow"
      />
      <div className="flex items-center gap-2">
        <button
          onClick={() => onAdd(node.id, "New Category")}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
        >
          <PlusIcon className="w-4 h-4" />
          <span className="sr-only">Add Subcategory</span>
        </button>
        <button
          onClick={() => onRemove(parentId, node.id)}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
        >
          <MinusIcon className="w-4 h-4" />
          <span className="sr-only">Remove Category</span>
        </button>
      </div>
    </div>
    {node.children.length > 0 && (
      <div className="grid gap-2 pl-6">
        {node.children.map((childNode) => (
          <TreeNode
            key={childNode.id}
            node={childNode}
            onAdd={onAdd}
            onRemove={onRemove}
            onUpdate={onUpdate}
            depth={depth + 1}
            parentId={node.id}
          />
        ))}
      </div>
    )}
  </div>
);

function MinusIcon(props: any) {
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
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon(props: any) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
