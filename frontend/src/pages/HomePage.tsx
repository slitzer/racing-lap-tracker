import React from 'react';
import { Timer } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto py-6 text-center">
      <div className="flex items-center justify-center space-x-2 mb-6">
        <Timer className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Racing Lap Tracker</h1>
      </div>
      <p className="text-muted-foreground">
        Track your fastest laps and compete with other drivers.
      </p>
    </div>
  );
};

export default HomePage;
