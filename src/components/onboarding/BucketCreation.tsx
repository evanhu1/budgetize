import { Tree, Node } from "@/components/Tree";

const rootNode: Node = {
  id: "0",
  label: "Food",
  children: [
    {
      id: "1",
      label: "Eating Out",
      children: [],
    },
    {
      id: "2",
      label: "Groceries",
      children: [
        {
          id: "3",
          label: "Trader Joes",
          children: [],
        },
      ],
    },
  ],
};

const BucketCreation = () => {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-black">
        Step 2: Create your first budget buckets!
      </h2>
      <p className="text-sm text-gray-500 mt-4">
        Now lets come up with some budget buckets. You can always add more
        later!
      </p>
      <Tree root={rootNode} depth={0} mode="edit" />
      <button className="border rounded px-3 py-1">Next</button>
    </div>
  );
};

export default BucketCreation;
