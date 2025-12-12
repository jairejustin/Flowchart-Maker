import { useRef, useCallback, useEffect } from "react";
import type { NodeData, EdgeAnchor, position } from "../lib/types";
import { useFlowStore } from "../store/flowStore";
import { getAnchorPoint } from "../lib/utils";

export function useEdgeDrag(
  edgeId: string,
  fromNodeId: string,
  toNodeId: string | undefined,
  storeEdgeTo: string | position,
  storeEdgeToAnchor: EdgeAnchor,
  storeEdgeFrom: string | position,
  storeEdgeFromAnchor: EdgeAnchor,
  nodes: NodeData[]
) {
  const mousePosRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });
  const draggingEndRef = useRef<"from" | "to" | null>(null); // track which is end
  const handlersRef = useRef<{
    onMouseMove: ((e: MouseEvent) => void) | null;
    onMouseUp: ((e: MouseEvent) => void) | null;
    onTouchMove: ((e: TouchEvent) => void) | null;
    onTouchEnd: ((e: TouchEvent) => void) | null;
  }>({
    onMouseMove: null,
    onMouseUp: null,
    onTouchMove: null,
    onTouchEnd: null,
  });

  const selectEdge = useCallback(
    (id: string | null) => useFlowStore.setState({ selectedEdgeId: id }),
    []
  );

  const allNodes = useFlowStore((state) => state.nodes);
  const updateEdgeHead = useFlowStore((state) => state.updateEdgeHead);
  const updateEdgeTail = useFlowStore((state) => state.updateEdgeTail);
  const setIsDraggingEdge = useFlowStore((state) => state.setIsDraggingEdge);
  const selectNode = useFlowStore((state) => state.selectNode);

  const cleanupListeners = useCallback(() => {
    if (handlersRef.current.onMouseMove) {
      document.removeEventListener("mousemove", handlersRef.current.onMouseMove);
      handlersRef.current.onMouseMove = null;
    }
    if (handlersRef.current.onMouseUp) {
      document.removeEventListener("mouseup", handlersRef.current.onMouseUp);
      handlersRef.current.onMouseUp = null;
    }
    if (handlersRef.current.onTouchMove) {
      document.removeEventListener("touchmove", handlersRef.current.onTouchMove);
      handlersRef.current.onTouchMove = null;
    }
    if (handlersRef.current.onTouchEnd) {
      document.removeEventListener("touchend", handlersRef.current.onTouchEnd);
      handlersRef.current.onTouchEnd = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanupListeners();
    };
  }, [cleanupListeners]);

  const onMove = useCallback(
    (clientX: number, clientY: number) => {
      const dx = clientX - mousePosRef.current.x;
      const dy = clientY - mousePosRef.current.y;

      const newX = startPosRef.current.x + dx;
      const newY = startPosRef.current.y + dy;

      const draggingEnd = draggingEndRef.current;
      if (!draggingEnd) return;

      // collision detection and snapping
      let snappedToNode = false;
      for (const node of allNodes) {
        // prevent snapping to the opposite point's node
        const oppositeNodeId = draggingEnd === "to" ? fromNodeId : toNodeId;
        if (node.id === oppositeNodeId) continue;

        const { x, y } = node.position;
        const { width, height } = node;

        // checks for collision with node bounding box
        if (newX > x && newX < x + width && newY > y && newY < y + height) {
          // snap to nearest side
          const distLeft = Math.abs(newX - x);
          const distRight = Math.abs(newX - (x + width));
          const distTop = Math.abs(newY - y);
          const distBottom = Math.abs(newY - (y + height));

          const minDist = Math.min(distLeft, distRight, distTop, distBottom);

          let anchorSide: "top" | "bottom" | "left" | "right" = "top";

          if (minDist === distLeft) {
            anchorSide = "left";
          } else if (minDist === distRight) {
            anchorSide = "right";
          } else if (minDist === distTop) {
            anchorSide = "top";
          } else {
            anchorSide = "bottom";
          }

          if (draggingEnd === "to") {
            updateEdgeHead(edgeId, node.id, { side: anchorSide });
          } else {
            updateEdgeTail(edgeId, node.id, { side: anchorSide });
          }
          snappedToNode = true;
          break;
        }
      }

      if (!snappedToNode) {
        if (draggingEnd === "to") {
          updateEdgeHead(edgeId, { x: newX, y: newY });
        } else {
          updateEdgeTail(edgeId, { x: newX, y: newY });
        }
      }
    },
    [allNodes, edgeId, fromNodeId, toNodeId, updateEdgeHead, updateEdgeTail]
  );

  const onEnd = useCallback(() => {
    cleanupListeners();
    setIsDraggingEdge(false);
    draggingEndRef.current = null;
  }, [setIsDraggingEdge, cleanupListeners]);

  // handler for "to" endpoint
  const onMouseDownHead = useCallback(
    (e: React.MouseEvent) => {
      cleanupListeners();
      e.stopPropagation();
      selectNode(null);

      const currentSelectedId = useFlowStore.getState().selectedEdgeId;
      if (edgeId === currentSelectedId) {
        selectEdge(null);
      } else {
        selectEdge(edgeId);
      }

      let p2: position;

      if (typeof storeEdgeTo === "string") {
        const toNode = nodes.find((n) => n.id === storeEdgeTo);
        if (!toNode) return;
        p2 = getAnchorPoint(toNode, storeEdgeToAnchor);
      } else {
        p2 = storeEdgeTo;
      }

      mousePosRef.current = { x: e.clientX, y: e.clientY };
      startPosRef.current = { x: p2.x, y: p2.y };
      draggingEndRef.current = "to";
      setIsDraggingEdge(true);

      const onMouseMove = (e: MouseEvent) => {
        onMove(e.clientX, e.clientY);
      };

      const onMouseUp = () => {
        onEnd();
      };

      handlersRef.current.onMouseMove = onMouseMove;
      handlersRef.current.onMouseUp = onMouseUp;

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [
      nodes,
      onEnd,
      onMove,
      selectNode,
      setIsDraggingEdge,
      storeEdgeTo,
      storeEdgeToAnchor,
      cleanupListeners,
      selectEdge,
      edgeId,
    ]
  );

  // handler for "from" endpoint
  const onMouseDownTail = useCallback(
    (e: React.MouseEvent) => {
      cleanupListeners();
      e.stopPropagation();
      selectNode(null);

      const currentSelectedId = useFlowStore.getState().selectedEdgeId;
      if (edgeId === currentSelectedId) {
        selectEdge(null);
      } else {
        selectEdge(edgeId);
      }

      let p1: position;

      if (typeof storeEdgeFrom === "string") {
        const fromNode = nodes.find((n) => n.id === storeEdgeFrom);
        if (!fromNode) return;
        p1 = getAnchorPoint(fromNode, storeEdgeFromAnchor);
      } else {
        p1 = storeEdgeFrom;
      }

      mousePosRef.current = { x: e.clientX, y: e.clientY };
      startPosRef.current = { x: p1.x, y: p1.y };
      draggingEndRef.current = "from";
      setIsDraggingEdge(true);

      const onMouseMove = (e: MouseEvent) => {
        onMove(e.clientX, e.clientY);
      };

      const onMouseUp = () => {
        onEnd();
      };

      handlersRef.current.onMouseMove = onMouseMove;
      handlersRef.current.onMouseUp = onMouseUp;

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [
      nodes,
      onEnd,
      onMove,
      selectNode,
      setIsDraggingEdge,
      storeEdgeFrom,
      storeEdgeFromAnchor,
      cleanupListeners,
      selectEdge,
      edgeId,
    ]
  );

  // similar handlers for touch events
  const onTouchStartHead = useCallback(
    (e: React.TouchEvent) => {
      cleanupListeners();
      e.stopPropagation();
      selectNode(null);

      const currentSelectedId = useFlowStore.getState().selectedEdgeId;
      if (edgeId === currentSelectedId) {
        selectEdge(null);
      } else {
        selectEdge(edgeId);
      }

      let p2: position;

      if (typeof storeEdgeTo === "string") {
        const toNode = nodes.find((n) => n.id === storeEdgeTo);
        if (!toNode) return;
        p2 = getAnchorPoint(toNode, storeEdgeToAnchor);
      } else {
        p2 = storeEdgeTo;
      }

      mousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      startPosRef.current = { x: p2.x, y: p2.y };
      draggingEndRef.current = "to";
      setIsDraggingEdge(true);

      const onTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      };

      const onTouchEnd = () => {
        onEnd();
      };

      handlersRef.current.onTouchMove = onTouchMove;
      handlersRef.current.onTouchEnd = onTouchEnd;

      document.addEventListener("touchmove", onTouchMove, { passive: false });
      document.addEventListener("touchend", onTouchEnd);
    },
    [
      nodes,
      onEnd,
      onMove,
      setIsDraggingEdge,
      storeEdgeTo,
      storeEdgeToAnchor,
      cleanupListeners,
      selectNode,
      selectEdge,
      edgeId,
    ]
  );

  const onTouchStartTail = useCallback(
    (e: React.TouchEvent) => {
      cleanupListeners();
      e.stopPropagation();
      selectNode(null);

      const currentSelectedId = useFlowStore.getState().selectedEdgeId;
      if (edgeId === currentSelectedId) {
        selectEdge(null);
      } else {
        selectEdge(edgeId);
      }

      let p1: position;

      if (typeof storeEdgeFrom === "string") {
        const fromNode = nodes.find((n) => n.id === storeEdgeFrom);
        if (!fromNode) return;
        p1 = getAnchorPoint(fromNode, storeEdgeFromAnchor);
      } else {
        p1 = storeEdgeFrom;
      }

      mousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      startPosRef.current = { x: p1.x, y: p1.y };
      draggingEndRef.current = "from";
      setIsDraggingEdge(true);

      const onTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      };

      const onTouchEnd = () => {
        onEnd();
      };

      handlersRef.current.onTouchMove = onTouchMove;
      handlersRef.current.onTouchEnd = onTouchEnd;

      document.addEventListener("touchmove", onTouchMove, { passive: false });
      document.addEventListener("touchend", onTouchEnd);
    },
    [
      nodes,
      onEnd,
      onMove,
      setIsDraggingEdge,
      storeEdgeFrom,
      storeEdgeFromAnchor,
      cleanupListeners,
      selectNode,
      selectEdge,
      edgeId,
    ]
  );

  return { 
    onMouseDownHead, 
    onTouchStartHead,
    onMouseDownTail,
    onTouchStartTail
  };
}