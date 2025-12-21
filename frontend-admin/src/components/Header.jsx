import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './AppIcon';
import Select from './ui/Select';

const Header = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [dateRange, setDateRange] = useState('7d');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const profileRef = useRef(null);

  const dateRangeOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const currentUser = {
    name: 'Admin User',
    email: 'admin@ottsonly.com',
    role: 'Platform Administrator',
    avatar: null
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef?.current && !profileRef?.current?.contains(event?.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleLogout = () => {
    // Clear admin token
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    
    // Show confirmation
    alert('Logged out successfully');
    
    // Redirect to login page
    navigate('/admin-login');
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-50 shadow-card">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex-1"></div>
        
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-semibold text-foreground">Admin Panel</h1>
        </div>

        <div className="flex-1 flex items-center justify-end space-x-4">
          <button
            onClick={toggleAutoRefresh}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-smooth ${
              autoRefresh
                ? 'bg-success/10 text-success hover:bg-success/20' :'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
            title={autoRefresh ? 'Auto-refresh enabled' : 'Auto-refresh disabled'}
          >
            <Icon
              name={autoRefresh ? 'RefreshCw' : 'Pause'}
              size={16}
              color="currentColor"
              className={autoRefresh ? 'animate-pulse-subtle' : ''}
            />
            <span className="text-sm font-medium hidden sm:inline">
              {autoRefresh ? 'Live' : 'Paused'}
            </span>
          </button>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted transition-smooth"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Icon name="User" size={18} color="var(--color-primary)" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">{currentUser?.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser?.role}</p>
              </div>
              <Icon
                name="ChevronDown"
                size={16}
                color="var(--color-muted-foreground)"
                className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-dropdown overflow-hidden">
                <div className="p-4 border-b border-border">
                  <p className="text-sm font-medium text-popover-foreground">{currentUser?.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{currentUser?.email}</p>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      console.log('Profile clicked');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-smooth"
                  >
                    <Icon name="User" size={16} color="currentColor" className="mr-3" />
                    Profile Settings
                  </button>
                  <button
                    onClick={() => {
                      console.log('Preferences clicked');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-smooth"
                  >
                    <Icon name="Settings" size={16} color="currentColor" className="mr-3" />
                    Preferences
                  </button>
                </div>
                <div className="border-t border-border py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-error hover:bg-error/10 transition-smooth"
                  >
                    <Icon name="LogOut" size={16} color="var(--color-error)" className="mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;