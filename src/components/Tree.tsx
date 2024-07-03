"use client"
import Image from 'next/image'


import { useState } from "react";

export type Node = {
    id: string;
    label: string;
    children: Node[];
};

type TreeProps = {
    root: Node,
    depth: number,
    mode: string,
}

export const Tree = ({ root, depth}: TreeProps) => {

    const [childrenVisible, setChildrenVisible] = useState(false)
    const handleOpen = () => {
        setChildrenVisible(!childrenVisible)
    }

    return (
        <div className="w-60">
            <div className={"flex my-3 p-2 rounded bg-white"} style={{ paddingLeft: depth * 20 + 10 }}>

                <div>
                    {root.children && root.children.length > 0 ?
                        childrenVisible ? <Image src="/assets/angle-small-down.png" alt="open arrow" width={20} height={20} priority={true} onClick={() => handleOpen()} /> :
                            <Image src="/assets/angle-small-right.png" alt="open arrow" width={20} height={20} priority={true} onClick={() => handleOpen()}/>
                        : <div className="pl-5"></div>}
                </div>
                <div className="pl-2 text-md text-gray-500">
                    {root.label}
                </div>

            </div>
            <div>
                {childrenVisible ? root.children.map(child => <Tree key={child.id} root={child} depth={depth + 1} />) : <></>}
            </div>
        </div>
    )
}
