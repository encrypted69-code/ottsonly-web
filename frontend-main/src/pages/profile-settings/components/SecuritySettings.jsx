// Code will be added manually
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SecuritySettings = ({ toast }) => {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const activeSessions = [
    {
      id: 1,
      device: 'Windows PC - Chrome',
      location: 'Mumbai, India',
      lastActive: '2 minutes ago',
      current: true
    },
    {
      id: 2,
      device: 'iPhone 14 - Safari',
      location: 'Mumbai, India',
      lastActive: '2 hours ago',
      current: false
    }
  ];

  const handlePasswordChange = (e) => {
    const { name, value } = e?.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!passwords.current) {
      newErrors.current = 'Current password is required';
    }
    
    if (!passwords.new) {
      newErrors.new = 'New password is required';
    } else if (passwords.new.length < 8) {
      newErrors.new = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwords.new)) {
      newErrors.new = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!passwords.confirm) {
      newErrors.confirm = 'Please confirm your password';
    } else if (passwords.new !== passwords.confirm) {
      newErrors.confirm = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = () => {
    if (!validatePassword()) return;

    setIsLoading(true);
    setTimeout(() => {
      setPasswords({ current: '', new: '', confirm: '' });
      setIsLoading(false);
      toast?.success('Password changed successfully');
    }, 1500);
  };

  const handleLogoutAll = () => {
    toast?.info('Logged out from all devices');
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
          <Icon name="Shield" size={20} color="var(--color-error)" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Security Settings</h2>
          <p className="text-sm text-muted-foreground">Manage password and login sessions</p>
        </div>
      </div>

      {/* Change Password */}
      <div className="space-y-4 pt-4">
        <h3 className="text-sm font-semibold text-foreground">Change Password</h3>
        
        <div className="space-y-4">
          <div className="relative">
            <Input
              label="Current Password"
              type={showPasswords.current ? "text" : "password"}
              name="current"
              value={passwords.current}
              onChange={handlePasswordChange}
              error={errors.current}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name={showPasswords.current ? "EyeOff" : "Eye"} size={18} />
            </button>
          </div>

          <div className="relative">
            <Input
              label="New Password"
              type={showPasswords.new ? "text" : "password"}
              name="new"
              value={passwords.new}
              onChange={handlePasswordChange}
              error={errors.new}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name={showPasswords.new ? "EyeOff" : "Eye"} size={18} />
            </button>
          </div>

          <div className="relative">
            <Input
              label="Confirm New Password"
              type={showPasswords.confirm ? "text" : "password"}
              name="confirm"
              value={passwords.confirm}
              onChange={handlePasswordChange}
              error={errors.confirm}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name={showPasswords.confirm ? "EyeOff" : "Eye"} size={18} />
            </button>
          </div>

          <Button
            variant="default"
            onClick={handleChangePassword}
            loading={isLoading}
            iconName="Lock"
            iconPosition="left"
            fullWidth
          >
            Change Password
          </Button>
        </div>
      </div>

      {/* Login Sessions */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Active Sessions</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogoutAll}
            iconName="LogOut"
            iconPosition="left"
          >
            Logout All
          </Button>
        </div>

        <div className="space-y-3">
          {activeSessions.map(session => (
            <div key={session.id} className="bg-muted/50 border border-border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                    <Icon name="Monitor" size={20} color="var(--color-muted-foreground)" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{session.device}</p>
                      {session.current && (
                        <span className="px-2 py-0.5 bg-success/10 text-success text-xs font-medium rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{session.location}</p>
                    <p className="text-xs text-muted-foreground mt-1">Last active: {session.lastActive}</p>
                  </div>
                </div>
                {!session.current && (
                  <Button variant="ghost" size="sm" iconName="X">
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
