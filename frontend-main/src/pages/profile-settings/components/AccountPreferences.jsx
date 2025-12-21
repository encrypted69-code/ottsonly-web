// Code will be added manually
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AccountPreferences = ({ preferences, onUpdate, toast }) => {
  const [prefs, setPrefs] = useState(preferences);

  const handleToggle = (key) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    onUpdate(updated);
    toast?.success('Preference updated');
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Settings" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Account Preferences</h2>
          <p className="text-sm text-muted-foreground">Customize your notifications and settings</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Notification Preferences */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name="ShoppingBag" size={18} color="var(--color-muted-foreground)" />
                <div>
                  <p className="text-sm font-medium text-foreground">Order Updates</p>
                  <p className="text-xs text-muted-foreground">Get notified about your orders</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('orderUpdates')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  prefs.orderUpdates ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    prefs.orderUpdates ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name="Wallet" size={18} color="var(--color-muted-foreground)" />
                <div>
                  <p className="text-sm font-medium text-foreground">Wallet Updates</p>
                  <p className="text-xs text-muted-foreground">Transaction and balance alerts</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('walletUpdates')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  prefs.walletUpdates ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    prefs.walletUpdates ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name="Gift" size={18} color="var(--color-muted-foreground)" />
                <div>
                  <p className="text-sm font-medium text-foreground">Offer Notifications</p>
                  <p className="text-xs text-muted-foreground">Get updates on deals and offers</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('offerNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  prefs.offerNotifications ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    prefs.offerNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Language Preference */}
        <div className="pt-4 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">Language</h3>
          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <div className="flex items-center gap-3">
              <Icon name="Globe" size={18} color="var(--color-muted-foreground)" />
              <p className="text-sm font-medium text-foreground">English</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPreferences;
