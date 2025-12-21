import React from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FilterPanel = ({ filters, onFilterChange, onApplyFilters, onResetFilters }) => {
  const platformOptions = [
    { value: 'all', label: 'All Platforms' },
    { value: 'netflix', label: 'Netflix' },
    { value: 'prime', label: 'Prime Video' },
    { value: 'disney', label: 'Disney+' },
    { value: 'hbo', label: 'HBO Max' },
    { value: 'hulu', label: 'Hulu' }
  ];

  const periodOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const segmentOptions = [
    { value: 'all', label: 'All Segments' },
    { value: 'power-users', label: 'Power Users' },
    { value: 'casual-viewers', label: 'Casual Viewers' },
    { value: 'new-subscribers', label: 'New Subscribers' },
    { value: 'at-risk', label: 'At-Risk Users' }
  ];

  const cohortOptions = [
    { value: 'none', label: 'No Comparison' },
    { value: 'previous-period', label: 'Previous Period' },
    { value: 'same-period-last-year', label: 'Same Period Last Year' }
  ];

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-card mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Filter" size={20} color="var(--color-primary)" className="mr-2" />
          Filters & Segments
        </h3>
        <Button
          variant="ghost"
          size="sm"
          iconName="RotateCcw"
          iconPosition="left"
          onClick={onResetFilters}
        >
          Reset
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          label="Platform"
          options={platformOptions}
          value={filters?.platform}
          onChange={(value) => onFilterChange('platform', value)}
        />

        <Select
          label="Time Period"
          options={periodOptions}
          value={filters?.period}
          onChange={(value) => onFilterChange('period', value)}
        />

        <Select
          label="User Segment"
          options={segmentOptions}
          value={filters?.segment}
          onChange={(value) => onFilterChange('segment', value)}
        />

        <Select
          label="Cohort Comparison"
          options={cohortOptions}
          value={filters?.cohort}
          onChange={(value) => onFilterChange('cohort', value)}
        />
      </div>
      <div className="flex items-center justify-end space-x-3 mt-4">
        <Button
          variant="outline"
          size="sm"
          iconName="Download"
          iconPosition="left"
        >
          Export Data
        </Button>
        <Button
          variant="default"
          size="sm"
          iconName="Search"
          iconPosition="left"
          onClick={onApplyFilters}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;