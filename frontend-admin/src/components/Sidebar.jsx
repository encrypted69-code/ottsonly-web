import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from './AppIcon';

const Sidebar = ({ isCollapsed = false }) => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [notifications] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'High Churn Risk',
      message: '12 users showing churn indicators',
      time: '5m ago',
      icon: 'AlertTriangle',
      unread: true
    },
    {
      id: 2,
      type: 'success',
      title: 'Revenue Milestone',
      message: 'Monthly target achieved: ₹5L',
      time: '1h ago',
      icon: 'TrendingUp',
      unread: true
    },
    {
      id: 3,
      type: 'info',
      title: 'New Referral Request',
      message: '3 withdrawal requests pending',
      time: '2h ago',
      icon: 'Gift',
      unread: false
    },
    {
      id: 4,
      type: 'error',
      title: 'System Alert',
      message: 'API response time increased',
      time: '3h ago',
      icon: 'AlertCircle',
      unread: false
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/executive-dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'Executive KPIs and strategic overview'
    },
    {
      label: 'Subscriptions',
      path: '/subscription-analytics',
      icon: 'Users',
      tooltip: 'Lifecycle analytics and churn prediction'
    },
    {
      label: 'Revenue',
      path: '/revenue-intelligence',
      icon: 'DollarSign',
      tooltip: 'Financial performance and transaction monitoring'
    },
    {
      label: 'Users',
      path: '/user-behavior-analytics',
      icon: 'Activity',
      tooltip: 'Behavioral analytics and engagement patterns'
    },
    {
      label: 'YouTube',
      path: '/youtube',
      icon: 'Youtube',
      tooltip: 'YouTube management and analytics'
    },
    {
      label: 'IDP',
      path: '/idp',
      icon: 'Lock',
      tooltip: 'ID & Password credentials manager'
    },
    {
      label: 'Referrals',
      path: '/referral-management',
      icon: 'Gift',
      tooltip: 'Referral program and withdrawal management'
    },
    {
      label: 'Notifications',
      path: '/notification-center',
      icon: 'Bell',
      tooltip: 'Send notifications to customers'
    },
    {
      label: 'Operations',
      path: '/operations-monitor',
      icon: 'Settings',
      tooltip: 'System monitoring and operational health'
    }
  ];

  const isActive = (path) => location?.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-card shadow-card hover:bg-muted transition-smooth"
        aria-label="Toggle navigation menu"
      >
        <Icon name={isMobileOpen ? 'X' : 'Menu'} size={24} color="var(--color-foreground)" />
      </button>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed lg:fixed top-0 left-0 h-full bg-card border-r border-border z-40 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-60'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="sidebar-header flex items-center justify-center h-16 border-b border-border bg-primary/10 transition-smooth">
          <div className={`sidebar-logo flex items-center justify-center rounded-lg transition-all duration-300 ${
            isCollapsed ? 'w-10 h-10' : 'w-12 h-12'
          }`}>
            <Icon 
              name="TrendingUp" 
              size={isCollapsed ? 24 : 32} 
              color="var(--color-primary)" 
              strokeWidth={2.5}
            />
          </div>
          {!isCollapsed && (
            <span className="ml-3 text-lg font-semibold text-primary">OTTSONLY</span>
          )}
        </div>

        <nav className="p-4 space-y-2">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center h-12 px-4 rounded-lg transition-smooth group relative ${
                isActive(item?.path)
                  ? 'bg-primary text-primary-foreground shadow-card'
                  : 'text-foreground hover:bg-muted hover:text-primary'
              }`}
              title={isCollapsed ? item?.tooltip : ''}
            >
              <Icon
                name={item?.icon}
                size={20}
                color={isActive(item?.path) ? 'var(--color-primary-foreground)' : 'currentColor'}
                strokeWidth={2}
              />
              {!isCollapsed && (
                <span className="ml-3 text-sm font-medium">{item?.label}</span>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg shadow-dropdown opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-smooth whitespace-nowrap z-50">
                  {item?.label}
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Notification Center Section */}
        {!isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-card">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon name="Bell" size={18} color="var(--color-foreground)" />
                  <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                </div>
                {unreadCount > 0 && (
                  <span className="bg-error text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                {notifications.slice(0, 3).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border transition-smooth cursor-pointer hover:shadow-card ${
                      notification.unread 
                        ? 'bg-primary/5 border-primary/20' 
                        : 'bg-muted/50 border-border'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        notification.type === 'warning' ? 'bg-warning/20' :
                        notification.type === 'success' ? 'bg-success/20' :
                        notification.type === 'error' ? 'bg-error/20' :
                        'bg-info/20'
                      }`}>
                        <Icon 
                          name={notification.icon} 
                          size={16} 
                          color={
                            notification.type === 'warning' ? 'var(--color-warning)' :
                            notification.type === 'success' ? 'var(--color-success)' :
                            notification.type === 'error' ? 'var(--color-error)' :
                            'var(--color-info)'
                          }
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground mb-1 truncate">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground mb-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => console.log('View all notifications')}
                className="w-full mt-3 py-2 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-smooth"
              >
                View All Notifications
              </button>
            </div>
          </div>
        )}

        {/* Collapsed Notification Badge */}
        {isCollapsed && unreadCount > 0 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="relative group">
              <div className="w-10 h-10 bg-error/20 rounded-lg flex items-center justify-center cursor-pointer hover:bg-error/30 transition-smooth">
                <Icon name="Bell" size={20} color="var(--color-error)" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              </div>
              <div className="absolute left-full ml-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg shadow-dropdown opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-smooth whitespace-nowrap z-50">
                {unreadCount} unread notifications
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;