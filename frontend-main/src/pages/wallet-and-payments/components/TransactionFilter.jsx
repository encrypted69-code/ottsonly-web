// Code will be added manually
import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';


const TransactionFilters = ({ filters, onFilterChange, onReset, onExport }) => {
  const transactionTypeOptions = [
    { value: 'all', label: 'All Transactions' },
    { value: 'credit', label: 'Credits Only' },
    { value: 'debit', label: 'Debits Only' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'success', label: 'Successful' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  return (
    <div className="bg-card rounded-xl p-6 border border-border space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Filter Transactions</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="RotateCcw"
            iconPosition="left"
            onClick={onReset}
          >
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={onExport}
          >
            Export
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          label="Date Range"
          options={dateRangeOptions}
          value={filters?.dateRange}
          onChange={(value) => onFilterChange('dateRange', value)}
        />

        <Select
          label="Transaction Type"
          options={transactionTypeOptions}
          value={filters?.type}
          onChange={(value) => onFilterChange('type', value)}
        />

        <Select
          label="Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => onFilterChange('status', value)}
        />

        <Input
          label="Search"
          type="search"
          placeholder="Search transactions..."
          value={filters?.search}
          onChange={(e) => onFilterChange('search', e?.target?.value)}
        />
      </div>
      {filters?.dateRange === 'custom' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <Input
            label="From Date"
            type="date"
            value={filters?.fromDate}
            onChange={(e) => onFilterChange('fromDate', e?.target?.value)}
          />
          <Input
            label="To Date"
            type="date"
            value={filters?.toDate}
            onChange={(e) => onFilterChange('toDate', e?.target?.value)}
          />
        </div>
      )}
    </div>
  );
};

export default TransactionFilters;