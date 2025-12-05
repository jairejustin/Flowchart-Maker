import { RgbColorPicker } from 'react-colorful';
import "./ColorPicker.css"

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join('');
};

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  const handleColorChange = (rgb: { r: number; g: number; b: number }) => {
    const hexColor = rgbToHex(rgb.r, rgb.g, rgb.b);
    onChange(hexColor);
  };

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    //allow typing then validate hex format
    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
      onChange(value);
    }
  };

  return (
    <div className='color-picker'>
      <RgbColorPicker
        color={hexToRgb(color)}
        onChange={handleColorChange}
      />
      <input
        type="text"
        value={color.toUpperCase()}
        onChange={handleHexInput}
        placeholder="#000000"
        maxLength={7}
      />
    </div>
  );
}