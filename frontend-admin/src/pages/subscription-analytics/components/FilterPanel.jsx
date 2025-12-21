import React from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FilterPanel = ({ filters, onFilterChange, onApplyFilters, onResetFilters }) => {
  const planOptions = [
    { value: 'all', label: 'All Plans' },
    { value: 'netflix', label: 'Netflix' },
    { value: 'prime', label: 'Prime Video' },
    { value: 'disney', label: 'Disney+' },
    { value: 'hotstar', label: 'Hotstar' }
  ];

  const cohortOptions = [
    { value: 'monthly', label: 'Monthly Cohorts' },
    { value: 'quarterly', label: 'Quarterly Cohorts' },
    { value: 'yearly', label: 'Yearly Cohorts' }
  ];

  const channelOptions = [
    { value: 'all', label: 'All Channels' },
    { value: 'organic', label: 'Organic Search' },
    { value: 'paid', label: 'Paid Advertising' },
    { value: 'social', label: 'Social Media' },
    { value: 'referral', label: 'Referral' },
    { value: 'direct', label: 'Direct' }
  ];

  const demographicOptions = [
    { value: 'all', label: 'All Demographics' },
    { value: '18-24', label: '18-24 years' },
    { value: '25-34', label: '25-34 years' },
    { value: '35-44', label: '35-44 years' },
    { value: '45-54', label: '45-54 years' },
    { value: '55+', label: '55+ years' }
  ];

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-card mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name="Filter" size={20} color="var(--color-primary)" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Advanced Filters</h3>
            <p className="text-sm text-muted-foreground">Segment and analyze subscription data</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          iconName="RotateCcw" 
          iconPosition="left"
          onClick={onResetFilters}
        >
          Reset All
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Select
          label="Subscription Plan"
          options={planOptions}
          value={filters?.plan}
          onChange={(value) => onFilterChange('plan', value)}
        />

        <Select
          label="Cohort Analysis"
          options={cohortOptions}
          value={filters?.cohort}
          onChange={(value) => onFilterChange('cohort', value)}
        />

        <Select
          label="Acquisition Channel"
          options={channelOptions}
          value={filters?.channel}
          onChange={(value) => onFilterChange('channel', value)}
        />

        <Select
          label="Demographics"
          options={demographicOptions}
          value={filters?.demographic}
          onChange={(value) => onFilterChange('demographic', value)}
        />
      </div>
      <div className="flex items-center justify-end space-x-3">
        <Button 
          variant="outline" 
          size="default"
          iconName="Download"
          iconPosition="left"
        >
          Export Data
        </Button>
        <Button 
          variant="default" 
          size="default"
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