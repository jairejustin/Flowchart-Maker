import React, { useState } from 'react';
import { useFlowStore } from '../../store/flowStore';
import './StylePanel.css';
import ColorPicker from "../color-picker/ColorPicker"

interface StylePanelProps {
  nodeId: string;
}

export default function StylePanel({ nodeId }: StylePanelProps) {
  const node = useFlowStore((state) => state.nodes.find(n => n.id === nodeId));
  const updateNodeContent = useFlowStore((state) => state.updateNodeContent);
  const updateNodeEditing = useFlowStore((state) => state.updateNodeEditing);
  const updateNodeStyles = useFlowStore((state) => state.updateNodeStyles);
  const [openPicker, setOpenPicker] = useState<string | null>(null);
  
  if (!node) {
    return null;
  }

  const text = node.content;
  const fontSize = node.style?.fontSize || 14;
  const textColor = node.style?.textColor || '#000000';
  const backgroundColor = node.style?.backgroundColor || '#ffffff';
  const borderColor = node.style?.borderColor || '#000000';
  const borderWidth = node.style?.borderWidth || 1;
  const borderRadius = node.style?.borderRadius || 0;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    updateNodeContent(node.id, newText);
  };

  const handleStyleChange = (property: string, value: string | number) => {
    updateNodeStyles(node.id, { [property]: value });
  };

  const openColorPicker = (pickerType: string, event: React.MouseEvent<HTMLDivElement>) => {
    setOpenPicker(pickerType);
  };

  return (
    <div className='style-panel'>
      <textarea
        className='style-panel__node-textbox'
        placeholder='Write text'
        autoFocus
        value={text}
        onBlur={() => {
          updateNodeEditing(node.id, false);
        }}
        onChange={handleTextChange}
      />

      <div className='style-row'>
        <label>Font size</label>
        <input
          type='number'
          className='style-input'
          value={fontSize}
          onChange={(e) => handleStyleChange('fontSize', Number(e.target.value))}
          min='8'
          max='72'
        />
      </div>

      <div className='style-row'>
        <label>Text color</label>
        <div
          className='style-input-color'
          style={{ backgroundColor: textColor, cursor: 'pointer' }}
          onClick={(e) => openColorPicker('text', e)}
        />
      </div>

      <div className='style-row'>
        <label>Background</label>
        <div
          className='style-input-color'
          style={{ backgroundColor: backgroundColor, cursor: 'pointer' }}
          onClick={(e) => openColorPicker('background', e)}
        />
      </div>

      <div className='style-row'>
        <label>Border color</label>
        <div
          className='style-input-color'
          style={{ backgroundColor: borderColor, cursor: 'pointer' }}
          onClick={(e) => openColorPicker('border', e)}
        />
      </div>

      <div className='style-row'>
        <label>Border width</label>
        <input
          type='number'
          className='style-input'
          value={borderWidth}
          onChange={(e) => handleStyleChange('borderWidth', Number(e.target.value))}
          min='1'
          max='10'
        />
      </div>

      <div className='style-row'>
        <label>Border radius</label>
        <input
          type='number'
          className='style-input'
          value={borderRadius}
          onChange={(e) => handleStyleChange('borderRadius', Number(e.target.value))}
          min='0'
          max='50'
        />
      </div>

      {openPicker === 'text' && (
        <ColorPicker
          color={textColor}
          onChange={(color) => handleStyleChange('textColor', color)}
        />
      )}

      {openPicker === 'background' && (
        <ColorPicker
          color={backgroundColor}
          onChange={(color) => handleStyleChange('backgroundColor', color)}
        />
      )}

      {openPicker === 'border' && (
        <ColorPicker
          color={borderColor}
          onChange={(color) => handleStyleChange('borderColor', color)}
        />
      )}
    </div>
  );
}