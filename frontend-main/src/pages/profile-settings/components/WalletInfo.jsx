// Code will be added manually
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WalletInfo = ({ walletBalance }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
          <Icon name="Wallet" size={20} color="var(--color-success)" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Wallet Information</h2>
          <p className="text-sm text-muted-foreground">View your wallet balance and activity</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
            <p className="text-3xl font-bold text-foreground">₹{walletBalance?.toFixed(2)}</p>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Last Activity</p>
              <p className="text-sm font-medium text-foreground mt-1">2 hours ago</p>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate('/wallet-and-payments')}
              iconName="ArrowRight"
              iconPosition="right"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={18} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Quick Access</p>
            <p className="text-xs text-muted-foreground">
              Add money, view transaction history, and manage payment methods from the Wallet & Payments section.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletInfo;
