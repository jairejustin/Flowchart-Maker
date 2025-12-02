import { create } from "zustand";
import type { NodeData, position } from "../lib/types";

interface FlowState {
  nodes: NodeData[];
  isDraggingNode: boolean;
  updateNodePosition: (id: string, newPosition: position) => void;
  updateNodeDimensions: (id: string, width: number, height: number) => void;
  updateNodeContent: (id: string, content: string) => void;
  updateNodeEditing: (id: string, editing: boolean) => void;
  setIsDraggingNode: (isDragging: boolean) => void;
  setNodes: (nodes: NodeData[]) => void;
}

export const useFlowStore = create<FlowState>((set) => ({
  nodes: [],
  isDraggingNode: false,
  
  updateNodePosition: (id, newPosition) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, position: newPosition } : node
      ),
    })),
  
  setIsDraggingNode: (isDraggingNode) => set({ isDraggingNode }),
  
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

  setNodes: (newNodes) => set({ nodes: newNodes }),
}));