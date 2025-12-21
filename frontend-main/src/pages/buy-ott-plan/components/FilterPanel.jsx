// Code will be added manually
import React from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const FilterPanel = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  isMobile, 
  isOpen, 
  onClose,
  resultCount 
}) => {
  const platformOptions = [
    { value: 'all', label: 'All Platforms' },
    { value: 'netflix', label: 'Netflix' },
    { value: 'prime', label: 'Prime Video' },
    { value: 'hotstar', label: 'Disney+ Hotstar' },
    { value: 'sonyliv', label: 'SonyLiv' },
    { value: 'zee5', label: 'Zee5' },
    { value: 'spotify', label: 'Spotify' }
  ];

  const durationOptions = [
    { value: 'all', label: 'All Durations' },
    { value: '1', label: '1 Month' },
    { value: '3', label: '3 Months' },
    { value: '6', label: '6 Months' },
    { value: '12', label: '12 Months' }
  ];

  const priceRangeOptions = [
    { value: 'all', label: 'All Prices' },
    { value: '0-100', label: 'Under $100' },
    { value: '100-200', label: '$100 - $200' },
    { value: '200-300', label: '$200 - $300' },
    { value: '300+', label: 'Above $300' }
  ];

  const hasActiveFilters = filters?.platform !== 'all' || filters?.duration !== 'all' || filters?.priceRange !== 'all';

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Icon name="SlidersHorizontal" size={20} color="var(--color-primary)" />
          <span>Filter Plans</span>
        </h3>
        {isMobile && (
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-micro">
            <Icon name="X" size={20} />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <Select
          label="Platform"
          options={platformOptions}
          value={filters?.platform}
          onChange={(value) => onFilterChange('platform', value)}
          className="w-full"
        />

        <Select
          label="Duration"
          options={durationOptions}
          value={filters?.duration}
          onChange={(value) => onFilterChange('duration', value)}
          className="w-full"
        />

        <Select
          label="Price Range"
          options={priceRangeOptions}
          value={filters?.priceRange}
          onChange={(value) => onFilterChange('priceRange', value)}
          className="w-full"
        />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{resultCount}</span> plans found
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            iconPosition="left"
            onClick={onClearFilters}
          >
            Clear All
          </Button>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div 
            className="fixed inset-0 bg-foreground/20 z-[150] animate-fade-in"
            onClick={onClose}
          />
        )}
        <div className={`
          fixed top-0 right-0 bottom-0 w-80 bg-background border-l border-border z-[200] p-6
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <FilterContent />
        </div>
      </>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6 sticky top-20">
      <FilterContent />
    </div>
  );
};

export default FilterPanel;