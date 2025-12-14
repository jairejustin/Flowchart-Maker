import React, { useState, useEffect, useRef } from 'react';
import { Square, SquareRoundCorner, Trash2, Copy, RefreshCw } from 'lucide-react';
import { useFlowStore } from '../../store/flowStore';
import './StylePanel.css';
import ColorPicker from "../color-picker/ColorPicker"

interface StylePanelProps {
  id: string;
  type: "Node" | "Edge"
}

export default function StylePanel({ id, type }: StylePanelProps) {
  const [openPicker, setOpenPicker] = useState<string | null>(null);

  const node = useFlowStore((state) =>
    type === "Node" ? state.nodes.find(n => n.id === id) : null
  );

  const edge = useFlowStore((state) =>
    type === "Edge" ? state.edges.find(e => e.id === id) : null
  );

  const fontSizeFromStore = node?.style?.fontSize || 14;
  const borderWidthFromStore = node?.style?.borderWidth || 2;
  const edgeWidthFromStore = edge?.style?.width || 2;

  const [fontSize, setFontSize] = useState<string>(String(fontSizeFromStore));
  const [borderWidth, setBorderWidth] = useState<string>(String(borderWidthFromStore));
  const [edgeWidth, setEdgeWidth] = useState<string>(String(edgeWidthFromStore));

  const [isFontSizeFocused, setIsFontSizeFocused] = useState(false);
  const [isBorderWidthFocused, setIsBorderWidthFocused] = useState(false);
  const [isEdgeWidthFocused, setIsEdgeWidthFocused] = useState(false);

  //==================================================================================
  // Sync local input state from store when not focused
  // This is safe: the focus checks should prevent infinite loops

  useEffect(() => {
    if (!isFontSizeFocused) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFontSize(String(fontSizeFromStore));
    }
  }, [fontSizeFromStore, isFontSizeFocused]);

  useEffect(() => {
    if (!isBorderWidthFocused) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBorderWidth(String(borderWidthFromStore));
    }
  }, [borderWidthFromStore, isBorderWidthFocused]);

  useEffect(() => {
    if (!isEdgeWidthFocused) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEdgeWidth(String(edgeWidthFromStore));
    }
  }, [edgeWidthFromStore, isEdgeWidthFocused]);

  //======================================================================================

  // Store pending values that need to be committed
  const pendingFontSize = useRef<string | null>(null);
  const pendingBorderWidth = useRef<string | null>(null);
  const pendingEdgeWidth = useRef<string | null>(null);

  //======================================================================================
  // Commit pending changes when component unmounts
  // Safe: only commits on unmount, uses getState() to avoid subscriptions
  // Dependencies are intentionally limited to stable values (type, id)

  useEffect(() => {
    return () => {
      if (type === "Node") {
        if (pendingFontSize.current !== null) {
          const numValue = Number(pendingFontSize.current);
          if (!isNaN(numValue)) {
            useFlowStore.getState().updateNodeStyles(id, { 
              fontSize: Math.max(8, Math.min(72, numValue)) 
            });
          }
        }
        if (pendingBorderWidth.current !== null) {
          const numValue = Number(pendingBorderWidth.current);
          if (!isNaN(numValue)) {
            useFlowStore.getState().updateNodeStyles(id, { 
              borderWidth: Math.max(0, Math.min(10, numValue)) 
            });
          }
        }
      }
      if (type === "Edge") {
        if (pendingEdgeWidth.current !== null) {
          const numValue = Number(pendingEdgeWidth.current);
          if (!isNaN(numValue)) {
            useFlowStore.getState().updateEdgeStyles(id, { 
              width: Math.max(1, Math.min(10, numValue)) 
            });
          }
        }
      }
    };
  }, [type, id]);
  
  //==========================================================================================

  const updateNodeContent = useFlowStore((state) => state.updateNodeContent);
  const updateNodeEditing = useFlowStore((state) => state.updateNodeEditing);
  const updateNodeStyles = useFlowStore((state) => state.updateNodeStyles);
  const updateEdgeStyles = useFlowStore((state) => state.updateEdgeStyles);
  const selectNode = useFlowStore((state) => state.selectNode);
  const selectEdge = useFlowStore((state) => state.selectEdge);
  const { addNode, deleteNode, deleteEdge, flipEdge } = useFlowStore();

  const openColorPicker = (pickerType: string) => {
    setOpenPicker(openPicker === pickerType ? null : pickerType);
  };

  //style panel for nodes
  if (type === "Node") {
    if (!node) {
      return null;
    }

    const text = node.content;
    const shape = node.shape;
    const textColor = node.style?.textColor || '#000000';
    const backgroundColor = node.style?.backgroundColor || '#ffffff';
    const borderColor = node.style?.borderColor || '#000000';
    const borderRadius = node.style?.borderRadius || 0;

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newText = e.target.value;
      updateNodeContent(node.id, newText);
    };

    const handleStyleChange = (property: string, value: string | number) => {
      updateNodeStyles(node.id, { [property]: value });
    };

    const handleDeleteNode = () => {
      deleteNode(node.id);
      selectNode(null);
    }

    const handleDuplicateNode = () => {
      const duplicateNodeData = {
        content: node.content,
        width: node.width,
        height: node.height,
        shape: node.shape,
        style: node.style,
        position: {
          x: node.position.x + 20,
          y: node.position.y + 20,
        },
      };

      const newId = addNode(duplicateNodeData);
      selectNode(newId);
    }

    const commitFontSize = () => {
      const numValue = Number(fontSize);
      if (!isNaN(numValue)) {
        handleStyleChange('fontSize', Math.max(8, Math.min(72, numValue)));
        pendingFontSize.current = null;
      } else {
        setFontSize(String(fontSizeFromStore));
        pendingFontSize.current = null;
      }
    };

    const commitBorderWidth = () => {
      const numValue = Number(borderWidth);
      if (!isNaN(numValue)) {
        handleStyleChange('borderWidth', Math.max(0, Math.min(10, numValue)));
        pendingBorderWidth.current = null;
      } else {
        setBorderWidth(String(borderWidthFromStore));
        pendingBorderWidth.current = null;
      }
    };

    return (
      <div className='style-panel'>
        <textarea
          className='style-panel__node-textbox'
          placeholder='Write text'
          value={text}
          onBlur={() => {
            updateNodeEditing(node.id, false);
          }}
          onChange={handleTextChange}
        />

        {/* Text Row */}
        <div className='style-row-compact'>
          <label>Text</label>
          <div className='style-row-compact__controls'>
            <div
              className='style-input-color'
              style={{ backgroundColor: textColor }}
              onClick={() => openColorPicker('text')}
            />
            <input
              type='number'
              className='style-input-small'
              value={fontSize}
              onFocus={() => setIsFontSizeFocused(true)}
              onChange={(e) => {
                setFontSize(e.target.value);
                pendingFontSize.current = e.target.value;
              }}
              onBlur={() => {
                setIsFontSizeFocused(false);
                commitFontSize();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  commitFontSize();
                  e.currentTarget.blur(); // Trigger onBlur to deselect the input
                }
              }}
              min='8'
              max='72'
            />
          </div>
        </div>

        {/* Background Row */}
        <div className='style-row-compact'>
          <label>Background</label>
          <div className='style-row-compact__controls'>
            <div
              className='style-input-color'
              style={{ backgroundColor: backgroundColor }}
              onClick={() => openColorPicker('background')}
            />
          </div>
        </div>

        {/* Border Row */}
        <div className='style-row-compact'>
          <label>Border</label>
          <div className='style-row-compact__controls'>
            <div
              className='style-input-color'
              style={{ backgroundColor: borderColor }}
              onClick={() => openColorPicker('border')}
            />
            <input
              type='number'
              className='style-input-small'
              value={borderWidth}
              onFocus={() => setIsBorderWidthFocused(true)}
              onChange={(e) => {
                setBorderWidth(e.target.value);
                pendingBorderWidth.current = e.target.value;
              }}
              onBlur={() => {
                setIsBorderWidthFocused(false);
                commitBorderWidth();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  commitBorderWidth();
                  e.currentTarget.blur(); // Trigger onBlur to deselect the input
                }
              }}
              min='0'
              max='10'
            />
            {shape === 'rectangle' && (
              <div className='border-type-buttons'>
                <button
                  className={`border-type-btn ${borderRadius === 0 ? 'active' : ''}`}
                  onClick={() => handleStyleChange('borderRadius', 0)}
                  title='Square corners'
                >
                  <Square size={16} strokeWidth={2} />
                </button>
                <button
                  className={`border-type-btn ${borderRadius > 0 ? 'active' : ''}`}
                  onClick={() => handleStyleChange('borderRadius', 10)}
                  title='Rounded corners'
                >
                  <SquareRoundCorner size={16} strokeWidth={2} />
                </button>
              </div>
            )}
          </div>
        </div>

        {openPicker === 'text' && (
          <ColorPicker
            color={textColor}
            target="Text Color"
            onChange={(color) => handleStyleChange('textColor', color)}
          />
        )}

        {openPicker === 'background' && (
          <ColorPicker
            color={backgroundColor}
            target="Background Color"
            onChange={(color) => handleStyleChange('backgroundColor', color)}
          />
        )}

        {openPicker === 'border' && (
          <ColorPicker
            color={borderColor}
            target="Border Color"
            onChange={(color) => handleStyleChange('borderColor', color)}
          />
        )}
        
        <div className='action-buttons'>
          <button
            className='action-button'
            onClick={handleDeleteNode}>
            <Trash2/>
          </button>
          <button
            className='action-button'
            onClick={handleDuplicateNode}>
            <Copy />
          </button>
        </div>
      </div>
    );
  }

  //style panel for edges
  if (type === "Edge") {
    if (!edge) {
      return null;
    }

    const edgeColor = edge.style?.color || '#000000';

    const handleEdgeStyleChange = (property: string, value: string | number) => {
      updateEdgeStyles(edge.id, { [property]: value });
    };

    const handleDeleteEdge = () => {
      deleteEdge(edge.id);
      selectEdge(null);
    }

    const handleFlipEdge = () => {
      flipEdge(edge.id);
    }

    const commitEdgeWidth = () => {
      const numValue = Number(edgeWidth);
      if (!isNaN(numValue)) {
        handleEdgeStyleChange('width', Math.max(1, Math.min(10, numValue)));
        pendingEdgeWidth.current = null;
      } else {
        setEdgeWidth(String(edgeWidthFromStore));
        pendingEdgeWidth.current = null;
      }
    };

    return (
      <div className='style-panel'>
        <div className='style-row-compact'>
          <label>Color</label>
          <div className='style-row-compact__controls'>
            <div
              className='style-input-color'
              style={{ backgroundColor: edgeColor }}
              onClick={() => openColorPicker('edgeColor')}
            />
          </div>
        </div>

        <div className='style-row-compact'>
          <label>Width</label>
          <div className='style-row-compact__controls'>
            <input
              type='number'
              className='style-input-small'
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
                if (e.key === 'Enter') {
                  commitEdgeWidth();
                  e.currentTarget.blur(); // Trigger onBlur to deselect the input
                }
              }}
              min='1'
              max='10'
            />
          </div>
        </div>

        {openPicker === 'edgeColor' && (
          <ColorPicker
            color={edgeColor}
            target="Edge Color"
            onChange={(color) => handleEdgeStyleChange('color', color)}
          />
        )}
        
        <div className='action-buttons'>
          <button
            className='action-button'
            onClick={handleDeleteEdge}>
            <Trash2/>
          </button>
          <button
            className='action-button'
            onClick={handleFlipEdge}>
            <RefreshCw/>
          </button>
        </div>
      </div>
    );
  }

  return null;
}