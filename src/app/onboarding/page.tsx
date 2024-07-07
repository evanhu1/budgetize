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
const OnboardingPage = () => {
    return (
        <div className="p-6 h-2000">
            <div className=" w-full sm:w-60">
                <Tree root={rootNode} depth={0} mode="edit" />
                <button className="border rounded px-3 py-1">Next</button>

            </div>


        </div>
    );
};

export default OnboardingPage;