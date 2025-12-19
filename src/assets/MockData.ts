import type { FlowDocument } from "../lib/types";

export const mockFlowDocument: FlowDocument = {
  id: "doc_001",
  title: "Sample Flowchart",
  createdAt: 1732600000000,
  updatedAt: 1732600500000,
  viewport: { "x": 0, "y": 0, "zoom": 1 },
  nodes: [
    {
      id: "node_start",
      shape: "rectangle",
      position: { x: 86.0118577075099, y: 111.08300395256917 },
      width: 140,
      height: 50,
      content: "Start",
      style: { borderRadius: 0, fontSize: 15 },
      editing: false
    },
    {
      id: "node_input",
      shape: "rectangle",
      position: { x: 66, y: 190 },
      width: 180,
      height: 60,
      content: "Get User Input",
      style: { borderRadius: 10 },
      editing: false
    },
    {
      id: "node_decision",
      shape: "diamond",
      position: { x: 85.88142292490119, y: 277.905138339921 },
      width: 140.23715415019763,
      height: 83.20158102766798,
      content: "Is Input Valid?",
      style: { borderRadius: 10 },
      editing: false
    },
    {
      id: "node_process",
      shape: "rectangle",
      position: { x: 244.2490118577075, y: 368.07114624505925 },
      width: 170,
      height: 60,
      content: "Process Input",
      style: { borderRadius: 10 },
      editing: false
    },
    {
      id: "node_end",
      shape: "rectangle",
      position: { x: 356.9644268774704, y: 293.0355731225296 },
      width: 124.23715415019763,
      height: 53,
      content: "End",
      style: {},
      editing: false
    },
    {
      id: "73fc4e75-5d44-46d4-a8d4-ff8c27abb728",
      position: { x: 447.36758893280637, y: 372.5 },
      width: 138,
      height: 50,
      content: "Print Output",
      shape: "rectangle",
      editing: false,
      style: {
        backgroundColor: "#ffffff",
        borderColor: "#000000",
        borderWidth: 2,
        borderRadius: 10,
        textColor: "#000000",
        fontSize: 14,
        fontWeight: "normal"
      }
    }
  ],
  edges: [
    {
      id: "edge_1",
      from: "node_start",
      to: "node_input",
      path: "straight",
      fromAnchor: { side: "bottom" },
      toAnchor: { side: "top" },
      points: []
    },
    {
      id: "edge_2",
      from: "node_input",
      to: "node_decision",
      path: "straight",
      fromAnchor: { side: "bottom" },
      toAnchor: { side: "top" },
      points: []
    },
    {
      id: "edge_3",
      from: "node_decision",
      to: "node_process",
      path: "straight",
      fromAnchor: { side: "bottom" },
      toAnchor: { side: "left" },
      points: [],
      label: { text: "True", t: 0.5, fontSize: 11 }
    },
    {
      id: "edge_4",
      from: "73fc4e75-5d44-46d4-a8d4-ff8c27abb728",
      to: "node_end",
      path: "straight",
      fromAnchor: { side: "top" },
      toAnchor: { side: "right" },
      points: [{ x: 450, y: 480 }, { x: 450, y: 560 }, { x: 270, y: 560 }],
      style: { width: 2 }
    },
    {
      id: "edge_5",
      from: "node_decision",
      to: "node_end",
      path: "straight",
      fromAnchor: { side: "right" },
      toAnchor: { side: "left" },
      points: [{ x: 420, y: 350 }, { x: 420, y: 605 }, { x: 200, y: 605 }],
      style: { width: 2 },
      label: { text: "False", t: 0.5, fontSize: 11 }
    },
    {
      id: "3193edaa-350a-4adf-800a-e8dba13c4cc1",
      from: "node_process",
      to: "73fc4e75-5d44-46d4-a8d4-ff8c27abb728",
      path: "straight",
      fromAnchor: { side: "right" },
      toAnchor: { side: "left" },
      style: { color: "#000", width: 2, dashed: false }
    },
    {
      id: "c83e685f-3514-467f-8e60-73bc99081587",
      from: "node_input",
      to: "node_end",
      path: "straight",
      fromAnchor: { side: "right" },
      toAnchor: { side: "top" },
      style: { color: "#ff0000", width: 2, dashed: false },
      label: { text: "Ctrl-D", t: 0.3, fontSize: 14 }
    }
  ]
};