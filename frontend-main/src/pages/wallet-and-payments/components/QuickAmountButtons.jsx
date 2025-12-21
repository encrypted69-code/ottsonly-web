// Code will be added manually
import React from 'react';
import Button from '../../../components/ui/Button';

const QuickAmountButtons = ({ amounts, onSelectAmount, selectedAmount }) => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Quick Add</h3>
          <p className="text-sm text-muted-foreground">Add money instantly with preset amounts</p>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:flex sm:flex-wrap">
          {amounts?.map((amount) => (
            <Button
              key={amount}
              variant={selectedAmount === amount ? 'default' : 'outline'}
              size="md"
              onClick={() => onSelectAmount(amount)}
              iconName="Plus"
              iconPosition="left"
            >
              ₹{amount}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickAmountButtons;