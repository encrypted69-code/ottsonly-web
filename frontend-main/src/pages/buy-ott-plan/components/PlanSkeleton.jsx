// Code will be added manually
import React from 'react';

const PlanSkeleton = () => {
  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-3 w-16 bg-muted rounded" />
          </div>
        </div>
        <div className="h-6 w-16 bg-muted rounded-md" />
      </div>

      <div className="space-y-2">
        <div className="h-8 w-32 bg-muted rounded" />
        <div className="h-4 w-24 bg-muted rounded" />
      </div>

      <div className="space-y-2">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-3/4 bg-muted rounded" />
      </div>

      <div className="flex gap-2">
        <div className="h-6 w-24 bg-muted rounded-md" />
        <div className="h-6 w-20 bg-muted rounded-md" />
      </div>

      <div className="h-10 w-full bg-muted rounded-lg" />
    </div>
  );
};

export default PlanSkeleton;