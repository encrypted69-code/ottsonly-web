// Code will be added manually
import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ onClearFilters }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <Icon name="SearchX" size={48} color="var(--color-muted-foreground)" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">No Plans Found</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        We couldn't find any subscription plans matching your current filters. Try adjusting your search criteria or clear all filters to see available plans.
      </p>
      <Button
        variant="default"
        iconName="RotateCcw"
        iconPosition="left"
        onClick={onClearFilters}
      >
        Clear All Filters
      </Button>
    </div>
  );
};

export default EmptyState;