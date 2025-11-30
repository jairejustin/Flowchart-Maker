import { create } from "zustand";
import type { NodeData, position } from "../lib/types";

interface FlowState {
  nodes: Record<string, NodeData>;
  isDraggingNode: boolean;
  updateNodePosition: (id: string, newPosition: position) => void;
  updateNodeDimensions: (id: string, width: number, height: number) => void;
  updateNodeContent: (id: string, content: string) => void;
  updateNodeEditing: (id: string, editing: boolean) => void;
  setIsDraggingNode: (isDragging: boolean) => void;
  setNodes: (nodes: Record<string, NodeData>) => void;
}

export const useFlowStore = create<FlowState>((set) => ({
  nodes: {},
  isDraggingNode: false,
  
  updateNodePosition: (id, newPosition) =>
    set((state) => ({
      nodes: {
        ...state.nodes,
        [id]: {
          ...state.nodes[id],
          position: newPosition,
        },
      },
    })),
  
  setIsDraggingNode: (isDraggingNode) => set({ isDraggingNode }),
  
  updateNodeDimensions: (id, width, height) =>
    set((state) => ({
      nodes: {
        ...state.nodes,
        [id]: {
          ...state.nodes[id],
          width,
          height,
        },
      },
    })),
  
  updateNodeContent: (id, content) =>
    set((state) => ({
      nodes: {
        ...state.nodes,
        [id]: {
          ...state.nodes[id],
          content,
        },
      },
    })),
  
  updateNodeEditing: (id, editing) =>
    set((state) => {
      const nodeToUpdate = state.nodes[id];
      if (!nodeToUpdate) return state;
      
      return {
        nodes: {
          ...state.nodes,
          [id]: {
            ...nodeToUpdate,
            editing,
          },
        },
      };
    }),
  
  setNodes: (nodes) => set({ nodes }),
}));