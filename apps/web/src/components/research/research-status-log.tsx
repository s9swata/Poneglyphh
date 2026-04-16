import React from 'react';

interface ResearchStatusLogProps {
  children: React.ReactNode;
}

export function ResearchStatusLog({ children }: ResearchStatusLogProps) {
  return (
    <div className="text-sm text-muted-foreground px-1 font-medium space-y-1">
      {children}
    </div>
  );
}
