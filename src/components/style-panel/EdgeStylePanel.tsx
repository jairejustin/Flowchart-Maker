import React, { useState, useEffect, useRef } from "react";
import { Trash2, RefreshCw } from "lucide-react";
import { useFlowStore } from "../../store/flowStore";
import "./StylePanel.css";
import ColorPicker from "../color-picker/ColorPicker";

interface EdgeStylePanelProps {
  id: string;
}

export default function EdgeStylePanel({ id }: EdgeStylePanelProps) {
  const [openPicker, setOpenPicker] = useState<string | null>(null);

  const edge = useFlowStore((state) => state.edges.find((e) => e.id === id));

  const edgeWidthFromStore = edge?.style?.width || 2;
  const edgeLabelTextFromStore = edge?.label?.text || "";
  const edgeLabelTFromStore = edge?.label?.t || 0.5;
  const edgeLabelFontSizeFromStore = edge?.label?.fontSize || 14;

  const [edgeWidth, setEdgeWidth] = useState<string>(
    String(edgeWidthFromStore)
  );
  const [labelText, setLabelText] = useState<string>(edgeLabelTextFromStore);
  const [labelPosition, setLabelPosition] = useState<string>(
    String(edgeLabelTFromStore)
  );
  const [labelFontSize, setLabelFontSize] = useState<string>(
    String(edgeLabelFontSizeFromStore)
  );

  const [isEdgeWidthFocused, setIsEdgeWidthFocused] = useState(false);
  const [isLabelTextFocused, setIsLabelTextFocused] = useState(false);
  const [isLabelPositionFocused, setIsLabelPositionFocused] = useState(false);
  const [isLabelFontSizeFocused, setIsLabelFontSizeFocused] = useState(false);

  // Store pending values that need to be committed
  const pendingEdgeWidth = useRef<string | null>(null);
  const pendingLabelFontSize = useRef<string | null>(null);

  // Sync local input state from store when not focused
  // Why ESLint warnings are disabled:
  // This is safe, the focus checks should prevent infinite loops
  useEffect(() => {
    if (!isEdgeWidthFocused) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEdgeWidth(String(edgeWidthFromStore));
    }
  }, [edgeWidthFromStore, isEdgeWidthFocused]);

  useEffect(() => {
    if (!isLabelTextFocused) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLabelText(edgeLabelTextFromStore);
    }
  }, [edgeLabelTextFromStore, isLabelTextFocused]);

  useEffect(() => {
    if (!isLabelPositionFocused) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLabelPosition(String(edgeLabelTFromStore));
    }
  }, [edgeLabelTFromStore, isLabelPositionFocused]);

  useEffect(() => {
    if (!isLabelFontSizeFocused) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLabelFontSize(String(edgeLabelFontSizeFromStore));
    }
  }, [edgeLabelFontSizeFromStore, isLabelFontSizeFocused]);

  // Commit pending changes when component unmounts
  useEffect(() => {
    return () => {
      if (pendingEdgeWidth.current !== null) {
        const numValue = Number(pendingEdgeWidth.current);
        if (!isNaN(numValue)) {
          useFlowStore.getState().updateEdgeStyles(id, {
            width: Math.max(1, Math.min(10, numValue)),
          });
        }
      }
      if (pendingLabelFontSize.current !== null) {
        const numValue = Number(pendingLabelFontSize.current);
        const currentLabel = useFlowStore.getState().edges.find(e => e.id === id)?.label;
        if (!isNaN(numValue) && currentLabel) {
          useFlowStore.getState().updateEdgeLabel(id, {
            ...currentLabel,
            fontSize: Math.max(8, Math.min(72, numValue)),
          });
        }
      }
    };
  }, [id]);

  const updateEdgeStyles = useFlowStore((state) => state.updateEdgeStyles);
  const updateEdgeLabel = useFlowStore((state) => state.updateEdgeLabel);
  const selectEdge = useFlowStore((state) => state.selectEdge);
  const { deleteEdge, flipEdge } = useFlowStore();

  if (!edge) {
    return null;
  }

  const edgeColor = edge.style?.color || "#000000";
  const isLabelActive = !!edge.label;

  const openColorPicker = (pickerType: string) => {
    setOpenPicker(openPicker === pickerType ? null : pickerType);
  };

  const handleEdgeStyleChange = (property: string, value: string | number) => {
    updateEdgeStyles(edge.id, { [property]: value });
  };

  const handleLabelToggle = () => {
    if (isLabelActive) {
      updateEdgeLabel(edge.id, undefined);
      setLabelText("");
    } else {
      updateEdgeLabel(edge.id, { text: "", t: 0.5, fontSize: 14 });
    }
  };

  const handleLabelTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setLabelText(newText);

    const currentLabel = edge.label;
    if (currentLabel) {
      updateEdgeLabel(edge.id, { ...currentLabel, text: newText });
    } else if (newText) {
      updateEdgeLabel(edge.id, { text: newText, t: 0.5, fontSize: 14 });
    }
  };

  const handleLabelPositionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = e.target.value;
    setLabelPosition(newValue);

    const numValue = Number(newValue);
    const currentLabel = edge.label;
    if (!isNaN(numValue) && currentLabel) {
      updateEdgeLabel(edge.id, {
        ...currentLabel,
        t: Math.max(0, Math.min(1, numValue)),
      });
    } else if (!isNaN(numValue) && !currentLabel) {
      updateEdgeLabel(edge.id, {
        text: "",
        t: Math.max(0, Math.min(1, numValue)),
        fontSize: 14,
      });
    }
  };

  const handleLabelFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLabelFontSize(newValue);
    pendingLabelFontSize.current = newValue;

    const numValue = Number(newValue);
    const currentLabel = edge.label;
    if (!isNaN(numValue) && currentLabel) {
      updateEdgeLabel(edge.id, {
        ...currentLabel,
        fontSize: Math.max(8, Math.min(72, numValue)),
      });
    }
  };

  const handleDeleteEdge = () => {
    deleteEdge(edge.id);
    selectEdge(null);
  };

  const handleFlipEdge = () => {
    flipEdge(edge.id);
  };

  const commitEdgeWidth = () => {
    const numValue = Number(edgeWidth);
    if (!isNaN(numValue)) {
      handleEdgeStyleChange("width", Math.max(1, Math.min(10, numValue)));
      pendingEdgeWidth.current = null;
    } else {
      setEdgeWidth(String(edgeWidthFromStore));
      pendingEdgeWidth.current = null;
    }
  };

  const commitLabelFontSize = () => {
    const numValue = Number(labelFontSize);
    const currentLabel = edge.label;
    if (!isNaN(numValue) && currentLabel) {
      updateEdgeLabel(edge.id, {
        ...currentLabel,
        fontSize: Math.max(8, Math.min(72, numValue)),
      });
      pendingLabelFontSize.current = null;
    } else {
      setLabelFontSize(String(edgeLabelFontSizeFromStore));
      pendingLabelFontSize.current = null;
    }
  };

  return (
    <div className="style-panel">
      <div className="style-row-compact">
        <label>Color</label>
        <div className="style-row-compact__controls">
          <div
            className="style-input-color"
            style={{ backgroundColor: edgeColor }}
            onClick={() => openColorPicker("edgeColor")}
          />
        </div>
      </div>

      <div className="style-row-compact">
        <label>Width</label>
        <div className="style-row-compact__controls">
          <input
            type="number"
            className="style-input-small"
            value={edgeWidth}
            onFocus={() => setIsEdgeWidthFocused(true)}
            onChange={(e) => {
              setEdgeWidth(e.target.value);
              pendingEdgeWidth.current = e.target.value;
            }}
            onBlur={() => {
              setIsEdgeWidthFocused(false);
              commitEdgeWidth();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                commitEdgeWidth();
                e.currentTarget.blur();
              }
            }}
            min="1"
            max="10"
          />
        </div>
      </div>

      {/* Label Toggle */}
      <div className="style-row-compact">
        <label>Label</label>
        <div className="style-row-compact__controls">
          <label className="switch">
            <input
              type="checkbox"
              checked={isLabelActive}
              onChange={handleLabelToggle}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      {isLabelActive && (
        <>
          {/* Label Text Input */}
          <textarea
            className="style-panel__node-textbox"
            placeholder="Enter label text"
            value={labelText}
            rows={2}
            onFocus={() => setIsLabelTextFocused(true)}
            onChange={handleLabelTextChange}
            onBlur={() => setIsLabelTextFocused(false)}
          />

          {/* Label Font Size */}
          <div className="style-row-compact">
            <label>Font Size</label>
            <div className="style-row-compact__controls">
              <input
                type="number"
                className="style-input-small"
                value={labelFontSize}
                onFocus={() => setIsLabelFontSizeFocused(true)}
                onChange={handleLabelFontSizeChange}
                onBlur={() => {
                  setIsLabelFontSizeFocused(false);
                  commitLabelFontSize();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    commitLabelFontSize();
                    e.currentTarget.blur();
                  }
                }}
                min="8"
                max="72"
              />
            </div>
          </div>

          {/* Label Position Slider */}
          <div className="style-row-compact">
            <label>Position</label>
            <div className="style-row-compact__controls">
              <input
                type="range"
                min="0.01"
                max="1"
                step="0.01"
                value={labelPosition}
                onFocus={() => setIsLabelPositionFocused(true)}
                onChange={handleLabelPositionChange}
                onBlur={() => setIsLabelPositionFocused(false)}
                className="label-position-slider"
              />
              <span className="label-position-value">
                {`${(Number(labelPosition) * 100).toFixed(0)}%`}
              </span>
            </div>
          </div>
        </>
      )}

      {openPicker === "edgeColor" && (
        <ColorPicker
          color={edgeColor}
          target="Edge Color"
          onChange={(color) => handleEdgeStyleChange("color", color)}
        />
      )}

      <div className="action-buttons">
        <button className="action-button" onClick={handleDeleteEdge}>
          <Trash2 />
        </button>
        <button className="action-button" onClick={handleFlipEdge}>
          <RefreshCw />
        </button>
      </div>
    </div>
  );
}