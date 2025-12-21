// Code will be added manually
import React from 'react';

import Button from '../../../components/ui/Button';

const BulkActions = ({ selectedCount, onExport, onClearSelection }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-slide-up">
      <div className="bg-card border border-border rounded-xl shadow-prominent px-6 py-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">{selectedCount}</span>
          </div>
          <span className="text-sm font-medium text-foreground">
            {selectedCount} {selectedCount === 1 ? 'subscription' : 'subscriptions'} selected
          </span>
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={onExport}
          >
            Export
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            iconName="X"
            onClick={onClearSelection}
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;