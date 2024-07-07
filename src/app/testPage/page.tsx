import { Tree } from "@/components/Tree";
import type { Node } from "@/components/Tree";

const rootNode: Node = {
  id: '0',
  label: 'Food',
  children: [
    {
      id: '1',
      label: 'Eating Out',
      children: [],
    },
    {
      id: '2',
      label: 'Groceries',
      children: [
        {
          id: '3',
          label: 'Trader Joes',
          children: [],
        },
      ],
    },
  ],
};
const TestPage = () => {
  return (
    <div className="p-6 h-2000">
      <Tree root={rootNode} depth={0} mode="nav"/>

</div>
  );
};

export default TestPage;