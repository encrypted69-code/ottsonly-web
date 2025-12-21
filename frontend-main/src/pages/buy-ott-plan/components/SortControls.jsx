// Code will be added manually
import React from 'react';
import Icon from '../../../components/AppIcon';

const SortControls = ({ sortBy, onSortChange }) => {
  const sortOptions = [
    { value: 'popular', label: 'Most Popular', icon: 'TrendingUp' },
    { value: 'price-low', label: 'Price: Low to High', icon: 'ArrowUp' },
    { value: 'price-high', label: 'Price: High to Low', icon: 'ArrowDown' },
    { value: 'savings', label: 'Highest Savings', icon: 'Percent' }
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
      {sortOptions?.map((option) => (
        <button
          key={option?.value}
          onClick={() => onSortChange(option?.value)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-standard
            ${sortBy === option?.value
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-foreground hover:bg-muted border border-border'
            }
          `}
        >
          <Icon 
            name={option?.icon} 
            size={16} 
            color={sortBy === option?.value ? 'var(--color-primary-foreground)' : 'currentColor'}
          />
          <span>{option?.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SortControls;