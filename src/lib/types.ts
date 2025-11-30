export type Viewport = {
  x: number 
  y: number
  zoom: number
}

export type position = {
  x: number
  y: number
}

export type shape = "rectangle" | "diamond"; // add more shapes as needed

type EdgeData = {
  id: string
  from: string
  to: string
  label?: string
  path?: "straight" | "smooth"
}

export interface NodeData {
  id: string;
  position: position;
  width: number;
  height: number;
  content: string;
  shape: "rectangle" | "diamond" | string;
  style?: {
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    textColor?: string;
    fontSize?: number;
    fontWeight?: string;
  };
  editing?: boolean;
}

export type FlowDocument = {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  nodes: Record<string, NodeData>
  edges: Record<string, EdgeData>
  viewport: Viewport
}


