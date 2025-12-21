// Code will be added manually
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const NavigationBar = ({ user, walletBalance, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications] = useState([
    {
      id: 1,
      title: 'Subscription Expiring Soon',
      message: 'Your Netflix Premium subscription expires in 3 days',
      time: '2 hours ago',
      read: false,
      type: 'warning'
    },
    {
      id: 2,
      title: 'New Plan Available',
      message: 'Disney+ Hotstar has a special offer for you',
      time: '5 hours ago',
      read: false,
      type: 'info'
    },
    {
      id: 3,
      title: 'Payment Successful',
      message: 'Your wallet has been credited with ₹500',
      time: '1 day ago',
      read: true,
      type: 'success'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'View your subscription overview'
    },
    {
      label: 'Browse Plans',
      path: '/buy-ott-plan',
      icon: 'ShoppingBag',
      tooltip: 'Discover and purchase OTT subscriptions'
    },
    {
      label: 'My Subscriptions',
      path: '/my-subscriptions',
      icon: 'PlaySquare',
      tooltip: 'Manage your active subscriptions'
    },
    {
      label: 'Wallet',
      path: '/wallet-and-payments',
      icon: 'Wallet',
      tooltip: 'Manage your wallet and payments'
    },
    {
      label: 'Refer',
      path: '/refer',
      icon: 'Users',
      tooltip: 'Refer & Earn rewards'
    }
  ];

  const isActive = (path) => location?.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleWalletClick = () => {
    navigate('/wallet-and-payments');
    setIsAccountMenuOpen(false);
  };

  const handleLogout = () => {
    setIsAccountMenuOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-[100]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate('/dashboard')}
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center transition-micro hover:bg-primary/20">
                  <Icon name="Tv" size={24} color="var(--color-primary)" />
                </div>
                <span className="text-xl font-semibold text-foreground">OTTSONLY</span>
              </div>

              <div className="hidden lg:flex items-center gap-1">
                {navigationItems?.map((item) => (
                  <button
                    key={item?.path}
                    onClick={() => handleNavigation(item?.path)}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-standard
                      flex items-center gap-2
                      ${isActive(item?.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                      }
                    `}
                    title={item?.tooltip}
                  >
                    <Icon name={item?.icon} size={18} />
                    <span>{item?.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {walletBalance !== undefined && (
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg border border-primary/20">
                  <Icon name="Wallet" size={16} color="var(--color-primary)" />
                  <span className="text-sm font-semibold text-foreground">₹{walletBalance?.toFixed(2)}</span>
                </div>
              )}

              {/* Notification Icon */}
              <div className="hidden lg:block relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative p-2 rounded-lg hover:bg-muted transition-standard"
                  title="Notifications"
                >
                  <Icon name="Bell" size={20} color="var(--color-foreground)" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotificationOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-[150]" 
                      onClick={() => setIsNotificationOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-prominent z-[200] animate-scale-in">
                      <div className="p-4 border-b border-border flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-4 border-b border-border hover:bg-muted/50 transition-micro cursor-pointer ${
                                !notification.read ? 'bg-primary/5' : ''
                              }`}
                              onClick={() => setIsNotificationOpen(false)}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                  notification.type === 'warning' ? 'bg-warning' :
                                  notification.type === 'success' ? 'bg-success' :
                                  'bg-info'
                                }`} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-foreground mb-1">
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground mb-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {notification.time}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center">
                            <Icon name="Bell" size={40} color="var(--color-muted-foreground)" className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm text-muted-foreground">No notifications</p>
                          </div>
                        )}
                      </div>
                      <div className="p-2 border-t border-border">
                        <button
                          onClick={() => {
                            setIsNotificationOpen(false);
                            // Navigate to notifications page if you have one
                          }}
                          className="w-full text-center py-2 text-xs font-medium text-primary hover:bg-primary/10 rounded-md transition-micro"
                        >
                          View all notifications
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="hidden lg:block relative">
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-standard"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-foreground">{user?.name || 'User'}</span>
                  <Icon 
                    name={isAccountMenuOpen ? 'ChevronUp' : 'ChevronDown'} 
                    size={16} 
                    color="var(--color-muted-foreground)" 
                  />
                </button>

                {isAccountMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-[150]" 
                      onClick={() => setIsAccountMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-prominent z-[200] animate-scale-in">
                      <div className="p-2">
                        <button
                          onClick={() => {
                            navigate('/profile-settings');
                            setIsAccountMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-micro"
                        >
                          <Icon name="Settings" size={16} />
                          <span>Profile Settings</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate('/support');
                            setIsAccountMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-micro"
                        >
                          <Icon name="HelpCircle" size={16} />
                          <span>Support</span>
                        </button>
                        <div className="h-px bg-border my-2" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-md transition-micro"
                        >
                          <Icon name="LogOut" size={16} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-muted transition-standard"
              >
                <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
              </button>

              {/* Mobile Notification Icon */}
              <button
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                  setIsMobileMenuOpen(false);
                }}
                className="lg:hidden relative p-2 rounded-lg hover:bg-muted transition-standard"
                title="Notifications"
              >
                <Icon name="Bell" size={20} color="var(--color-foreground)" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Notification Panel */}
      {isNotificationOpen && (
        <>
          <div 
            className="fixed inset-0 bg-foreground/20 z-[150] lg:hidden animate-fade-in"
            onClick={() => setIsNotificationOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 bg-background border-b border-border z-[200] lg:hidden animate-slide-up shadow-prominent max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="overflow-y-auto flex-1">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-border hover:bg-muted/50 transition-micro cursor-pointer ${
                      !notification.read ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => setIsNotificationOpen(false)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        notification.type === 'warning' ? 'bg-warning' :
                        notification.type === 'success' ? 'bg-success' :
                        'bg-info'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground mb-1">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Icon name="Bell" size={40} color="var(--color-muted-foreground)" className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">No notifications</p>
                </div>
              )}
            </div>
            <div className="p-2 border-t border-border">
              <button
                onClick={() => {
                  setIsNotificationOpen(false);
                  // Navigate to notifications page if you have one
                }}
                className="w-full text-center py-2 text-xs font-medium text-primary hover:bg-primary/10 rounded-md transition-micro"
              >
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}

      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-foreground/20 z-[150] lg:hidden animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 bg-background border-b border-border z-[200] lg:hidden animate-slide-up shadow-prominent">
            <div className="p-4 space-y-2">
              <button
                onClick={handleWalletClick}
                className="w-full flex items-center justify-between px-4 py-3 bg-card rounded-lg border border-border"
              >
                <div className="flex items-center gap-3">
                  <Icon name="Wallet" size={20} color="var(--color-primary)" />
                  <span className="text-sm font-medium text-foreground">Wallet Balance</span>
                </div>
                <span className="font-mono text-sm font-medium text-foreground">
                  ₹{walletBalance?.toFixed(2) || '0.00'}
                </span>
              </button>

              {navigationItems?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-standard
                    ${isActive(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                    }
                  `}
                >
                  <Icon name={item?.icon} size={20} />
                  <span>{item?.label}</span>
                </button>
              ))}

              <div className="h-px bg-border my-2" />

              <button
                onClick={() => {
                  navigate('/profile-settings');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted rounded-lg transition-micro"
              >
                <Icon name="Settings" size={20} />
                <span>Profile Settings</span>
              </button>

              <button
                onClick={() => {
                  navigate('/support');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted rounded-lg transition-micro"
              >
                <Icon name="HelpCircle" size={20} />
                <span>Support</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-error hover:bg-error/10 rounded-lg transition-micro"
              >
                <Icon name="LogOut" size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-[100] lg:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {navigationItems?.map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`
                flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-standard min-w-[72px]
                ${isActive(item?.path)
                  ? 'text-primary' :'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Icon 
                name={item?.icon} 
                size={22} 
                color={isActive(item?.path) ? 'var(--color-primary)' : 'currentColor'}
              />
              <span className="text-xs font-medium">{item?.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default NavigationBar;