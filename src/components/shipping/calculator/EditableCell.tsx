import React, { useState, useRef, useEffect } from 'react';

interface EditableCellProps {
  value: string;
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: (value: string) => void;
  type?: 'text' | 'number';
}

export default function EditableCell({
  value,
  isEditing,
  onEdit,
  onUpdate,
  type = 'text'
}: EditableCellProps) {
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onUpdate(editValue);
    } else if (e.key === 'Escape') {
      setEditValue(value);
      onUpdate(value);
    }
  };

  if (isEditing) {
    return (
      <td className="px-4 py-2">
        <input
          ref={inputRef}
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => onUpdate(editValue)}
          onKeyDown={handleKeyDown}
          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          min={type === 'number' ? "0" : undefined}
          step={type === 'number' ? "0.01" : undefined}
        />
      </td>
    );
  }

  return (
    <td 
      className="px-4 py-2 cursor-pointer hover:bg-gray-50" 
      onClick={onEdit}
    >
      {value}
    </td>
  );
}