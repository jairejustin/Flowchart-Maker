import { create } from "zustand";
import type { NodeData, position, NodeStyle, EdgeData, EdgeAnchor } from "../lib/types";

interface FlowState {
  nodes: NodeData[];
  edges: EdgeData[];
  selectedNodeId: string | null;
  isDraggingNode: boolean;
  isResizingNode: boolean;
  isDraggingEdge: boolean;

  selectNode: (id: string | null) => void;
  setIsDraggingNode: (isDragging: boolean) => void;
  setIsResizingNode: (isResizing: boolean) => void;
  setIsDraggingEdge: (isDragging: boolean) => void;

  updateNodePosition: (id: string, newPosition: position) => void;
  updateEdgeHead: (id: string, to: string | position, toAnchor?: EdgeAnchor) => void;
  updateNodeDimensions: (id: string, width: number, height: number) => void;
  updateNodeContent: (id: string, content: string) => void;
  updateNodeEditing: (id: string, editing: boolean) => void;
  updateNodeStyles: (id: string, style: Partial<NodeStyle>) => void;

  setNodes: (nodes: NodeData[]) => void;
  setEdges: (edges: EdgeData[]) => void;
}

export const useFlowStore = create<FlowState>((set) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  isDraggingNode: false,
  isResizingNode: false,
  isDraggingEdge: false,

  selectNode: (id) => set({ selectedNodeId: id }),
  setIsDraggingNode: (isDraggingNode) => set({ isDraggingNode }),
  setIsResizingNode: (isResizingNode) => set({ isResizingNode }),
  setIsDraggingEdge: (isDraggingEdge) => set({ isDraggingEdge }),

  updateNodePosition: (id, newPosition) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, position: newPosition } : node
      ),
    })),

  updateEdgeHead: (id, to, toAnchor) =>
    set((state) => ({
      nodes: state.nodes, // nodes remain unchanged
      edges: state.edges.map((edge) =>
        edge.id === id ? { ...edge, to, toAnchor: toAnchor || edge.toAnchor } : edge
      ),
    })),

  updateNodeDimensions: (id, width, height) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, width, height } : node
      ),
    })),

  updateNodeContent: (id, content) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, content } : node
      ),
    })),

  updateNodeEditing: (id, editing) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, editing } : node
      ),
    })),

  updateNodeStyles: (id, style) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? { ...node, style: { ...node.style!, ...style } }
          : node
      ),
    })),

  setNodes: (newNodes) => set({ nodes: newNodes }),
  setEdges: (newEdges) => set({ edges: newEdges }),
}));
