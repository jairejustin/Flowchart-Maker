import type { NodeData } from "../../lib/types";
import "./Node.css";

export const Node = ({ node }: { node: NodeData }) => {
    return (
        <div
            className="node"
            style={{
                left: node.x,
                top: node.y,
                width: node.width,
                height: node.height,
                border: `${node.style?.borderWidth || 2}px solid ${node.style?.borderColor || "#333"
                    }`,
                backgroundColor: node.style?.backgroundColor || "#fff",
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
