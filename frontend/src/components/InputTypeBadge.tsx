import React from 'react';

interface InputTypeBadgeProps {
  inputType?: string;
  className?: string;
}

const icons: Record<string, string> = {
  Wheel: '🛞',
  Controller: '🎮',
  Keyboard: '⌨️',
};

const InputTypeBadge: React.FC<InputTypeBadgeProps> = ({ inputType, className }) => {
  if (!inputType) return null;
  return (
    <span
      className={`bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs inline-flex items-center gap-1 ${
        className || ''
      }`.trim()}
    >
      <span>{icons[inputType] || ''}</span>
      {inputType}
    </span>
  );
};

export default InputTypeBadge;
