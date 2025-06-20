import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => (
  <div className="w-full h-2 bg-gray-200 rounded">
    <div
      className="h-full bg-blue-500 rounded"
      style={{ width: `${progress}%` }}
    />
  </div>
);

export default ProgressBar;
