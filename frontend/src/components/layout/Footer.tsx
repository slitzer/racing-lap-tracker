import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t py-4 text-center text-sm text-muted-foreground">
      <p>&copy; {new Date().getFullYear()} Racing Tracker</p>
    </footer>
  );
};

export default Footer;
