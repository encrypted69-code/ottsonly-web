// Code will be added manually
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AccountControl = ({ toast }) => {
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  const activityLogs = [
    {
      id: 1,
      type: 'login',
      icon: 'LogIn',
      title: 'Successful Login',
      description: 'Logged in from Windows PC',
      time: '2 hours ago',
      iconBg: 'bg-success/10',
      iconColor: 'var(--color-success)'
    },
    {
      id: 2,
      type: 'profile',
      icon: 'User',
      title: 'Profile Updated',
      description: 'Phone number was changed',
      time: '1 day ago',
      iconBg: 'bg-primary/10',
      iconColor: 'var(--color-primary)'
    },
    {
      id: 3,
      type: 'security',
      icon: 'Shield',
      title: 'Password Changed',
      description: 'Password was successfully updated',
      time: '3 days ago',
      iconBg: 'bg-warning/10',
      iconColor: 'var(--color-warning)'
    }
  ];

  const handleDeactivate = () => {
    setShowDeactivateModal(false);
    toast?.error('Account deactivated. You will be logged out shortly.');
  };

  return (
    <>
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="Activity" size={20} color="var(--color-warning)" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Activity & Account Control</h2>
            <p className="text-sm text-muted-foreground">View recent activity and manage account</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
          {activityLogs.map(log => (
            <div key={log.id} className="bg-muted/50 border border-border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 ${log.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon name={log.icon} size={18} color={log.iconColor} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{log.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{log.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{log.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Account Deactivation */}
        <div className="pt-4 border-t border-border">
          <div className="bg-error/5 border border-error/20 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-4">
              <Icon name="AlertTriangle" size={20} color="var(--color-error)" className="flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground mb-1">Danger Zone</p>
                <p className="text-xs text-muted-foreground">
                  Deactivating your account will disable access to all services. This action can be reversed by contacting support.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowDeactivateModal(true)}
              iconName="XCircle"
              iconPosition="left"
              className="border-error text-error hover:bg-error/10"
            >
              Deactivate Account
            </Button>
          </div>
        </div>
      </div>

      {/* Deactivate Confirmation Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="AlertTriangle" size={32} color="var(--color-error)" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Deactivate Account?</h3>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to deactivate your account? You will lose access to all your subscriptions and data.
              </p>
            </div>

            <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
              <p className="text-xs text-foreground">
                <strong>Note:</strong> You can reactivate your account by contacting our support team within 30 days.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeactivateModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleDeactivate}
                className="flex-1 bg-error hover:bg-error/90"
                iconName="XCircle"
                iconPosition="left"
              >
                Deactivate
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountControl;
