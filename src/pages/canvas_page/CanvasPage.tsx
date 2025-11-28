import { useState, useRef, useEffect, useCallback } from "react";
import type { FlowDocument } from "../../lib/types";
import { Node } from "../../components/node/Node";
import Toolbar from "../../components/toolbar/Toolbar";
import ZoomControls from "../../components/zoom-controls/ZoomControls";

import "./CanvasPage.css";

interface CanvasPageProps {
  flowDocument: FlowDocument;
}

export default function CanvasPage(CanvasPageProps: CanvasPageProps) {
  const { flowDocument } = CanvasPageProps;
  const nodes = Object.values(flowDocument.nodes);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsPanning(true);
    lastMousePos.current = { x: event.clientX, y: event.clientY };
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isPanning) return;

    const dx = event.clientX - lastMousePos.current.x;
    const dy = event.clientY - lastMousePos.current.y;

    setTranslateX((prev) => prev + dx);
    setTranslateY((prev) => prev + dy);

    lastMousePos.current = { x: event.clientX, y: event.clientY };
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleMouseLeave = () => {
    setIsPanning(false);
  };

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault(); // Prevent default page scrolling

    const scaleFactor = 1.1;
    const newScale = event.deltaY < 0 ? scale * scaleFactor : scale / scaleFactor;

    // Limit zoom (TODO: add buttons to control zoom levels)
    if (newScale > 0.1 && newScale < 5) {
      const rect = event.currentTarget.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const newTranslateX = mouseX - (mouseX - translateX) * (newScale / scale);
      const newTranslateY = mouseY - (mouseY - translateY) * (newScale / scale);

      setTranslateX(newTranslateX);
      setTranslateY(newTranslateY);
      setScale(newScale);
    }
  };

  // Zoom handlers
  function snap(value: number) {
  return Math.round(value * 1000) / 1000; }

  const onZoomIn = () => {
    const next = snap(scale + 0.05);
    if (next <= 5) setScale(next);
  };

  const onZoomOut = () => {
    const next = snap(scale - 0.05);
    if (next >= 0.1) setScale(next);
  };

  return (
    <div
      className="canvas"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onWheel={handleWheel}
    >
        <Toolbar />
        <ZoomControls
        zoomFactor={scale} 
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}/>
        <div
          style={{
            transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
            transformOrigin: '0 0',
            overflow: 'visible',
          }}
        >
          {nodes.map((node) => (
              <Node node={node} />
          ))}
        </div>
    </div>
  );
};