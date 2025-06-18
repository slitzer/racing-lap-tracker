import React from 'react';
import { Timer } from 'lucide-react';

const LapTimesPage: React.FC = () => {
  return (
    <div className="container py-6 text-center">
      <div className="flex items-center justify-center space-x-2 mb-6">
        <Timer className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Lap Times</h1>
      </div>
      <p className="text-muted-foreground">Lap time listings will be added soon.</p>
    </div>
  );
};

export default LapTimesPage;
