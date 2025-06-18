import React from 'react';
import { Settings } from 'lucide-react';

const AdminPage: React.FC = () => {
  return (
    <div className="container py-6 text-center">
      <div className="flex items-center justify-center space-x-2 mb-6">
        <Settings className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Admin</h1>
      </div>
      <p className="text-muted-foreground">Admin functionality coming soon.</p>
    </div>
  );
};

export default AdminPage;
