// Code will be added manually
import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const SearchAndFilter = ({ 
  searchQuery, 
  onSearchChange, 
  selectedPlatform, 
  onPlatformChange,
  selectedDateRange,
  onDateRangeChange,
  platforms 
}) => {
  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'last_7_days', label: 'Last 7 Days' },
    { value: 'last_30_days', label: 'Last 30 Days' },
    { value: 'last_90_days', label: 'Last 90 Days' },
    { value: 'this_year', label: 'This Year' }
  ];

  const platformOptions = [
    { value: 'all', label: 'All Platforms' },
    ...platforms?.map(platform => ({
      value: platform?.toLowerCase()?.replace(/\s+/g, '_'),
      label: platform
    }))
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon name="Search" size={18} color="var(--color-muted-foreground)" />
          </div>
          <Input
            type="search"
            placeholder="Search subscriptions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="pl-10"
          />
        </div>

        <Select
          options={platformOptions}
          value={selectedPlatform}
          onChange={onPlatformChange}
          placeholder="Filter by platform"
        />

        <Select
          options={dateRangeOptions}
          value={selectedDateRange}
          onChange={onDateRangeChange}
          placeholder="Filter by date"
        />
      </div>
    </div>
  );
};

export default SearchAndFilter;