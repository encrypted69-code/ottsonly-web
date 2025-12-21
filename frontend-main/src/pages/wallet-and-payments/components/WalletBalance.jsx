// Code will be added manually
import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WalletBalanceCard = ({ balance, onAddMoney }) => {
  return (
    <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 lg:p-8 border border-primary/20">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Icon name="Wallet" size={20} color="var(--color-primary)" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Available Balance</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl lg:text-5xl font-bold text-foreground font-mono">
              ₹{balance?.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Last updated: {new Date()?.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            variant="default"
            size="lg"
            iconName="Plus"
            iconPosition="left"
            onClick={onAddMoney}
            fullWidth
            className="lg:w-auto"
          >
            Add Money
          </Button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon name="Shield" size={14} color="var(--color-success)" />
            <span>Secure & Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletBalanceCard;