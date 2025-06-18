/**
 * Profile Page Component
 * Created by MiniMax Agent
 */
import React from 'react';
import { User } from 'lucide-react';
const ProfilePage: React.FC = () => {
  return (
    <div className="container py-6">
      <div className="flex items-center space-x-2 mb-6">
        <User className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>
      
      <div className="text-center py-12 text-muted-foreground">
        <User className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <h2 className="text-xl font-semibold mb-2">Profile Coming Soon</h2>
        <p>The user profile functionality will be implemented in the next phase.</p>
      </div>
    </div>
  );
};
export default ProfilePage;