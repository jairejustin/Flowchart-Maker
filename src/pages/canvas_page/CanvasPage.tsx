import { Node } from "../../components/node/Node";
import { mockFlowDocument } from "../../assets/MockData";

export default function CanvasPage() {
  const nodes = Object.values(mockFlowDocument.nodes);
  return (
      <div>
          {nodes.map((node) => (
              <Node node={node} />
          ))}
      </div>
  );
};
