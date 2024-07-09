"use client";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import Image from "next/image";

export type Node = {
  id: string;
  label: string;
  children: Node[];
};

type TreeProps = {
  root: Node;
  depth: number;
  mode: string;
};

export const Tree = ({ root, depth, mode }: TreeProps) => {
  const [childrenVisible, setChildrenVisible] = useState(false);
  const [newChildLabel, setNewChildLabel] = useState("");
  const [displayNewChild, setDisplayNewChild] = useState(false);

  const handleToggle = () => {
    setChildrenVisible(!childrenVisible);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      root.children.push({
        //TODO: replace this with an API call to create a new bucket since we don't have access to the top level right now
        id: uuid(),
        label: newChildLabel,
        children: [],
      });
      setNewChildLabel("");
      setDisplayNewChild(false);
    }
  };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            root.children.push({ //TODO: replace this with an API call to create a new bucket since we don't have access to the top level right now
                id: uuid(),
                label: newChildLabel,
                children: [],
            })
            setNewChildLabel("")
            setChildrenVisible(true)
        }
    }

    const handleAdd = () => {
        setChildrenVisible(true)
        setDisplayNewChild(true)
    }

    const handleRemove = () => {
        //TODO: api call to remove this node from the tree
    }

    return (
        <div className="w-full min-w-80">
            <div className="flex items-center">
                <div className={"flex my-3 p-2 rounded bg-white border-2 w-full"} style={{ paddingLeft: depth * 20 + 10 }}>

                    <div>
                        {root.children && root.children.length > 0 ?
                            childrenVisible ? <Image src="/assets/angle-small-down.png" alt="close arrow" width={20} height={20} priority={true} onClick={() => handleToggle()} /> :
                                <Image src="/assets/angle-small-right.png" alt="open arrow" width={20} height={20} priority={true} onClick={() => handleToggle()} />
                            : <div className="pl-5"></div>}
                    </div>
                    <div className="pl-2 text-md text-gray-500">
                        {root.label}
                    </div>
                </div>
                {mode === "edit" ?
                    <>
                        <div className="ml-2">
                            <Image src="/assets/add.png" alt="add bucket" width={20} height={20} priority={true} onClick={() => handleAdd()} />
                        </div>
                        <div className="ml-2">
                            <Image src="/assets/minus.png" alt="remove bucket" width={20} height={20} priority={true} onClick={() => handleRemove()} />
                        </div>
                    </>
                    : <></>}
            </div>

            <div>
                {childrenVisible ? root.children.map(child => <Tree key={child.id} root={child} depth={depth + 1} mode={mode} />) : <></>}
            </div>
            {displayNewChild ?
                <div className={"flex my-3 p-2 rounded bg-white border-2 border-dashed opacity-70"} style={{ paddingLeft: depth * 20 + 10 }}>
                    <input autoFocus type="text" id="first_name" className="w-full focus:outline-none" placeholder="Enter bucket name" value={newChildLabel} onBlur={() => setDisplayNewChild(false)} onChange={(e) => setNewChildLabel(e.target.value)} onKeyDown={handleKeyDown} />
                </div> : <></>}
        </div>
        {mode === "edit" ? (
          <>
            <div className="ml-2">
              <Image
                src="/assets/add.png"
                alt="add bucket"
                width={20}
                height={20}
                priority={true}
                onClick={() => handleAdd()}
              />
            </div>
            <div className="ml-2">
              <Image
                src="/assets/minus.png"
                alt="remove bucket"
                width={20}
                height={20}
                priority={true}
                onClick={() => handleRemove()}
              />
            </div>
          </>
        ) : (
          <></>
        )}
      </div>

      <div>
        {childrenVisible ? (
          root.children.map((child) => (
            <Tree key={child.id} root={child} depth={depth + 1} mode={mode} />
          ))
        ) : (
          <></>
        )}
      </div>
      {displayNewChild ? (
        <div
          className={
            "flex my-3 p-2 rounded bg-white border-2 border-dashed opacity-70"
          }
          style={{ paddingLeft: depth * 20 + 10 }}
        >
          <input
            autoFocus
            type="text"
            id="first_name"
            className="w-full focus:outline-none"
            placeholder="Enter bucket name"
            value={newChildLabel}
            onBlur={() => setDisplayNewChild(false)}
            onChange={(e) => setNewChildLabel(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
