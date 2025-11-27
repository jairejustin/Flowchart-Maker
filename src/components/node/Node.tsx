import type { NodeData } from "../../lib/types";
import { useRef, useState } from "react";
import "./Node.css";

export const Node = ({ node }: { node: NodeData }) => {
    const [position, setPosition] = useState(node.position);
    let mouseStartPos = { x: 0, y: 0 };
    const cardRef = useRef<HTMLDivElement>(null);

    const mouseMove = (e: MouseEvent) => {
        //1 - Calculate move direction
        let mouseMoveDir = {
            x: mouseStartPos.x - e.clientX,
            y: mouseStartPos.y - e.clientY,
        };
    
        //2 - Update start position for next move.
        mouseStartPos.x = e.clientX;
        mouseStartPos.y = e.clientY;
    
        //3 - Update card top and left position.
        if (cardRef.current) {
           setPosition({
               x: cardRef.current.offsetLeft - mouseMoveDir.x,
               y: cardRef.current.offsetTop - mouseMoveDir.y,
           });
        }
    };

    const mouseUp = () => {
       document.removeEventListener("mousemove", mouseMove);
       document.removeEventListener("mouseup", mouseUp);
    };

    const mouseDown = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent canvas panning when dragging a node
        mouseStartPos.x = e.clientX;
        mouseStartPos.y = e.clientY;
        
        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("mouseup", mouseUp);
    };

    return (
        <div
            ref={cardRef}
            className="node"
            onMouseDown={mouseDown}
            style={{
                left: position.x,
                top: position.y,
                width: node.width,
                height: node.height,
                border: `${node.style?.borderWidth 
                    || 2}px solid ${node.style?.borderColor 
                    || "#333"
                    }`,
                backgroundColor: node.style?.backgroundColor 
                || "#fff",
            }}
        >
            <textarea
                defaultValue={node.content}
                style={{
                    color: node.style?.textColor || "#000",
                    fontSize: node.style?.fontSize || 14,
                    fontWeight: node.style?.fontWeight || "normal",
                }}
            />
        </div>
    );
};
