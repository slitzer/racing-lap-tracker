import React from 'react';
import { PlusCircle } from 'lucide-react';

const SubmitLapTimePage: React.FC = () => {
  return (
    <div className="container py-6 text-center">
      <div className="flex items-center justify-center space-x-2 mb-6">
        <PlusCircle className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Submit Lap Time</h1>
      </div>
      <p className="text-muted-foreground">Form to submit lap times will be implemented later.</p>
    </div>
  );
};

export default SubmitLapTimePage;
