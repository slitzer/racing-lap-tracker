import React from 'react';

interface AssistTagsProps {
  assists?: string[];
  className?: string;
}

const AssistTags: React.FC<AssistTagsProps> = ({ assists, className }) => {
  if (!assists || assists.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-1 ${className || ''}`.trim()}>
      {assists.map((assist) => (
        <span
          key={assist}
          className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs"
        >
          {assist}
        </span>
      ))}
    </div>
  );
};

export default AssistTags;
