"use client";

import { TreeNode, useTreeData } from "../categoryTree/Tree";

const dummyData = [
  {
    id: "food",
    name: "Food",
    children: [
      {
        id: "fastFood",
        name: "Fast Food",
        children: [
          {
            id: "fastFood-1",
            name: "Burgers",
            children: [],
          },
          {
            id: "fastFood-2",
            name: "Pizza",
            children: [],
          },
        ],
      },
      {
        id: "drinks",
        name: "Drinks",
        children: [
          {
            id: "drinks-1",
            name: "Soda",
            children: [],
          },
          {
            id: "drinks-2",
            name: "Juice",
            children: [],
          },
        ],
      },
    ],
  },
];

export function CategoryCreation({
  handleSaveTreeData,
}: {
  handleSaveTreeData: (treeData: TreeNode[]) => void;
}) {
  const { treeData, addChildNode, removeChildNode, updateNodeName } =
    useTreeData(dummyData);

  return (
    <div className="w-[600px] rounded-lg h-full sm:h-[600px] overflow-scroll">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Bucket Creator
        </h3>
        <p className="text-sm text-muted-foreground">
          Create and manage your bucket categories.
        </p>
      </div>
      <div className="p-6 pt-0">
        <div className="grid gap-4">
          {treeData.map((topNode) => (
            <TreeNode
              key={topNode.id}
              node={topNode}
              onAdd={addChildNode}
              onRemove={removeChildNode}
              onUpdate={updateNodeName}
              depth={0}
              parentId={null}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center p-6 pt-0">
        <button
          onClick={() => addChildNode(null, "New Top-Level Category")}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mr-2"
        >
          Add Top-Level Category
        </button>
        <button
          onClick={() => handleSaveTreeData(treeData)}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Go to dashboard
        </button>
      </div>
    </div>
  );
}
