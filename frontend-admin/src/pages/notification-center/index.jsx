import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import { notificationAPI } from '../../services/api';

const NotificationCenter = () => {
  const [activeTab, setActiveTab] = useState('send');
  const [loading, setLoading] = useState(false);
  const [sentNotifications, setSentNotifications] = useState([]);
  const [stats, setStats] = useState({
    total_sent: 0,
    total_opened: 0,
    total_clicked: 0,
    open_rate: 0,
    click_rate: 0
  });
  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    type: 'info',
    targetAudience: 'all',
    priority: 'normal',
    actionUrl: '',
    expiresIn: '7'
  });

  useEffect(() => {
    if (activeTab === 'history') {
      loadNotificationHistory();
    } else if (activeTab === 'analytics') {
      loadNotificationStats();
    }
  }, [activeTab]);

  const loadNotificationHistory = async () => {
    try {
      setLoading(true);
      const history = await notificationAPI.getHistory();
      setSentNotifications(history);
    } catch (error) {
      console.error('Failed to load history:', error);
      alert('Failed to load notification history');
    } finally {
      setLoading(false);
    }
  };

  const loadNotificationStats = async () => {
    try {
      setLoading(true);
      const statsData = await notificationAPI.getStats();
      setStats(statsData);
      const history = await notificationAPI.getHistory();
      setSentNotifications(history);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const notificationTypes = [
    { value: 'info', label: 'Info', icon: 'Info', color: 'var(--color-info)' },
    { value: 'success', label: 'Success', icon: 'CheckCircle', color: 'var(--color-success)' },
    { value: 'warning', label: 'Warning', icon: 'AlertTriangle', color: 'var(--color-warning)' },
    { value: 'error', label: 'Error', icon: 'XCircle', color: 'var(--color-error)' }
  ];

  const targetAudienceOptions = [
    { value: 'all', label: 'All Users (2,500+)' },
    { value: 'active', label: 'Active Subscribers (2,100+)' },
    { value: 'inactive', label: 'Inactive Users (400+)' },
    { value: 'premium', label: 'Premium Users (850+)' },
    { value: 'new', label: 'New Users (Last 7 days - 150+)' },
    { value: 'custom', label: 'Custom Segment' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const expiryOptions = [
    { value: '1', label: '1 Day' },
    { value: '3', label: '3 Days' },
    { value: '7', label: '7 Days' },
    { value: '30', label: '30 Days' },
    { value: 'never', label: 'Never Expire' }
  ];

  const handleInputChange = (field, value) => {
    setNotificationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendNotification = async () => {
    if (!notificationData.title || !notificationData.message) {
      alert('Please fill in title and message');
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type,
        target_audience: notificationData.targetAudience,
        action_url: notificationData.actionUrl || null,
        priority: notificationData.priority
      };

      const response = await notificationAPI.sendBulkNotification(payload);
      
      alert(`Notification sent successfully to ${response.users_notified} users!`);
      
      // Reset form
      setNotificationData({
        title: '',
        message: '',
        type: 'info',
        targetAudience: 'all',
        priority: 'normal',
        actionUrl: '',
        expiresIn: '7'
      });

      // Refresh history if on that tab
      if (activeTab === 'history') {
        loadNotificationHistory();
      }
    } catch (error) {
      console.error('Failed to send notification:', error);
      alert('Failed to send notification: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    const typeObj = notificationTypes.find(t => t.value === type);
    return typeObj ? { icon: typeObj.icon, color: typeObj.color } : { icon: 'Bell', color: 'var(--color-foreground)' };
  };

  const calculateEngagementRate = (opened, recipients) => {
    return recipients > 0 ? ((opened / recipients) * 100).toFixed(1) : '0.0';
  };

  return (
    <>
      <Helmet>
        <title>Notification Center - Admin Panel</title>
        <meta name="description" content="Send and manage customer notifications" />
      </Helmet>

      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        
        <div className="flex-1 flex flex-col lg:ml-60">
          <Header />
          
          <main className="flex-1 overflow-auto pt-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
              {/* Page Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon name="Bell" size={24} color="var(--color-primary)" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">Notification Center</h1>
                    <p className="text-muted-foreground">Send notifications and announcements to customers</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6 border-b border-border">
                <button
                  onClick={() => setActiveTab('send')}
                  className={`px-6 py-3 font-medium transition-smooth border-b-2 ${
                    activeTab === 'send'
                      ? 'text-primary border-primary'
                      : 'text-muted-foreground border-transparent hover:text-foreground'
                  }`}
                >
                  <Icon name="Send" size={18} className="inline mr-2" />
                  Send Notification
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-6 py-3 font-medium transition-smooth border-b-2 ${
                    activeTab === 'history'
                      ? 'text-primary border-primary'
                      : 'text-muted-foreground border-transparent hover:text-foreground'
                  }`}
                >
                  <Icon name="History" size={18} className="inline mr-2" />
                  Notification History
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-6 py-3 font-medium transition-smooth border-b-2 ${
                    activeTab === 'analytics'
                      ? 'text-primary border-primary'
                      : 'text-muted-foreground border-transparent hover:text-foreground'
                  }`}
                >
                  <Icon name="BarChart3" size={18} className="inline mr-2" />
                  Analytics
                </button>
              </div>

              {/* Send Notification Tab */}
              {activeTab === 'send' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Form Section */}
                  <div className="lg:col-span-2">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-card">
                      <h2 className="text-xl font-bold text-foreground mb-6">Create New Notification</h2>
                      
                      <div className="space-y-5">
                        {/* Title */}
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Notification Title *
                          </label>
                          <Input
                            type="text"
                            placeholder="Enter notification title"
                            value={notificationData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-full"
                          />
                        </div>

                        {/* Message */}
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Message *
                          </label>
                          <Textarea
                            placeholder="Enter notification message..."
                            value={notificationData.message}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                            rows={4}
                            className="w-full"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {notificationData.message.length}/500 characters
                          </p>
                        </div>

                        {/* Type and Priority */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Notification Type
                            </label>
                            <Select
                              value={notificationData.type}
                              onChange={(e) => handleInputChange('type', e.target.value)}
                              options={notificationTypes}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Priority Level
                            </label>
                            <Select
                              value={notificationData.priority}
                              onChange={(e) => handleInputChange('priority', e.target.value)}
                              options={priorityOptions}
                            />
                          </div>
                        </div>

                        {/* Target Audience */}
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Target Audience
                          </label>
                          <Select
                            value={notificationData.targetAudience}
                            onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                            options={targetAudienceOptions}
                          />
                        </div>

                        {/* Action URL */}
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Action URL (Optional)
                          </label>
                          <Input
                            type="url"
                            placeholder="e.g., /buy-ott-plan or https://..."
                            value={notificationData.actionUrl}
                            onChange={(e) => handleInputChange('actionUrl', e.target.value)}
                            className="w-full"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Link users will be redirected to when clicking notification
                          </p>
                        </div>

                        {/* Expiry */}
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Expires In
                          </label>
                          <Select
                            value={notificationData.expiresIn}
                            onChange={(e) => handleInputChange('expiresIn', e.target.value)}
                            options={expiryOptions}
                          />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t border-border">
                          <Button
                            onClick={handleSendNotification}
                            iconName="Send"
                            iconPosition="left"
                            className="flex-1"
                            disabled={loading}
                          >
                            {loading ? 'Sending...' : 'Send Notification'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => console.log('Schedule for later')}
                            iconName="Clock"
                            iconPosition="left"
                            disabled={loading}
                          >
                            Schedule
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preview Section */}
                  <div className="lg:col-span-1">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-card sticky top-24">
                      <h3 className="text-lg font-bold text-foreground mb-4">Preview</h3>
                      
                      <div className="space-y-4">
                        <div className="bg-background border border-border rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              notificationData.type === 'info' ? 'bg-info/20' :
                              notificationData.type === 'success' ? 'bg-success/20' :
                              notificationData.type === 'warning' ? 'bg-warning/20' :
                              'bg-error/20'
                            }`}>
                              <Icon 
                                name={getTypeIcon(notificationData.type).icon}
                                size={20}
                                color={getTypeIcon(notificationData.type).color}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground mb-1">
                                {notificationData.title || 'Notification Title'}
                              </p>
                              <p className="text-xs text-muted-foreground mb-2">
                                {notificationData.message || 'Your notification message will appear here...'}
                              </p>
                              <p className="text-xs text-muted-foreground">Just now</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-background rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Recipients:</span>
                            <span className="font-semibold text-foreground">
                              {targetAudienceOptions.find(o => o.value === notificationData.targetAudience)?.label.match(/\d+/)?.[0] || '0'} users
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Priority:</span>
                            <span className={`font-semibold ${
                              notificationData.priority === 'urgent' ? 'text-error' :
                              notificationData.priority === 'high' ? 'text-warning' :
                              'text-foreground'
                            }`}>
                              {priorityOptions.find(o => o.value === notificationData.priority)?.label}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Expires:</span>
                            <span className="font-semibold text-foreground">
                              {expiryOptions.find(o => o.value === notificationData.expiresIn)?.label}
                            </span>
                          </div>
                        </div>

                        <div className="bg-info/10 border border-info/20 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <Icon name="Info" size={16} color="var(--color-info)" className="mt-0.5" />
                            <p className="text-xs text-info">
                              Notifications are delivered instantly to user devices and appear in their notification center.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
                  <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-bold text-foreground">Notification History</h2>
                    <p className="text-sm text-muted-foreground mt-1">View all sent notifications</p>
                  </div>

                  {loading ? (
                    <div className="p-12 text-center">
                      <Icon name="Loader" size={40} color="var(--color-primary)" className="animate-spin mx-auto mb-4" />
                      <p className="text-muted-foreground">Loading history...</p>
                    </div>
                  ) : sentNotifications.length === 0 ? (
                    <div className="p-12 text-center">
                      <Icon name="Bell" size={40} color="var(--color-muted-foreground)" className="mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">No notifications sent yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Notification</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Audience</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Stats</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {sentNotifications.map((notification, index) => (
                            <tr key={notification._id || index} className="hover:bg-muted/30 transition-smooth">
                              <td className="px-6 py-4">
                                <div>
                                  <p className="text-sm font-semibold text-foreground">{notification.title}</p>
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{notification.message}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                                  notification.type === 'info' ? 'bg-info/10 text-info' :
                                  notification.type === 'success' ? 'bg-success/10 text-success' :
                                  notification.type === 'warning' ? 'bg-warning/10 text-warning' :
                                  'bg-error/10 text-error'
                                }`}>
                                  <Icon name={getTypeIcon(notification.type).icon} size={12} />
                                  {notification.type}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-sm text-foreground capitalize">{notification.target_audience || 'all'}</span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-sm text-muted-foreground">
                                  {new Date(notification.sent_at).toLocaleString()}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-xs space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Icon name="Users" size={12} color="var(--color-muted-foreground)" />
                                    <span className="text-foreground">{notification.recipients_count || 0} sent</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Icon name="Eye" size={12} color="var(--color-success)" />
                                    <span className="text-success">{notification.opened_count || 0} opened</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Icon name="MousePointer" size={12} color="var(--color-primary)" />
                                    <span className="text-primary">{notification.clicked_count || 0} clicked</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  {loading ? (
                    <div className="p-12 text-center">
                      <Icon name="Loader" size={40} color="var(--color-primary)" className="animate-spin mx-auto mb-4" />
                      <p className="text-muted-foreground">Loading analytics...</p>
                    </div>
                  ) : (
                    <>
                      {/* Stats Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Icon name="Send" size={24} color="var(--color-primary)" />
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold text-foreground mb-1">{stats.total_sent || 0}</h3>
                          <p className="text-sm text-muted-foreground">Total Sent</p>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                              <Icon name="Eye" size={24} color="var(--color-success)" />
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold text-foreground mb-1">{stats.total_opened || 0}</h3>
                          <p className="text-sm text-muted-foreground">Total Opened</p>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                              <Icon name="MousePointer" size={24} color="var(--color-warning)" />
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold text-foreground mb-1">{stats.total_clicked || 0}</h3>
                          <p className="text-sm text-muted-foreground">Total Clicks</p>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                              <Icon name="TrendingUp" size={24} color="var(--color-info)" />
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold text-foreground mb-1">{stats.open_rate || 0}%</h3>
                          <p className="text-sm text-muted-foreground">Avg Open Rate</p>
                        </div>
                      </div>

                      {/* Performance Chart */}
                      <div className="bg-card border border-border rounded-xl p-6 shadow-card">
                        <h3 className="text-lg font-bold text-foreground mb-4">Notification Performance</h3>
                        <div className="space-y-4">
                          {sentNotifications.map((notification, index) => {
                            const openRate = calculateEngagementRate(notification.opened_count || 0, notification.recipients_count || 0);
                            const clickRate = calculateEngagementRate(notification.clicked_count || 0, notification.recipients_count || 0);
                            
                            return (
                              <div key={notification._id || index} className="border border-border rounded-lg p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-foreground">{notification.title}</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {new Date(notification.sent_at).toLocaleString()}
                                    </p>
                                  </div>
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    notification.type === 'success' ? 'bg-success/10 text-success' :
                                    notification.type === 'warning' ? 'bg-warning/10 text-warning' :
                                    'bg-info/10 text-info'
                                  }`}>
                                    {notification.type}
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-4 text-center">
                                  <div>
                                    <p className="text-lg font-bold text-foreground">{notification.recipients_count || 0}</p>
                                    <p className="text-xs text-muted-foreground">Sent</p>
                                  </div>
                                  <div>
                                    <p className="text-lg font-bold text-success">{openRate}%</p>
                                    <p className="text-xs text-muted-foreground">Open Rate</p>
                                  </div>
                                  <div>
                                    <p className="text-lg font-bold text-primary">{clickRate}%</p>
                                    <p className="text-xs text-muted-foreground">Click Rate</p>
                                  </div>
                                </div>

                                <div className="mt-3 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground w-16">Opened:</span>
                                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-success rounded-full transition-all"
                                        style={{ width: `${openRate}%` }}
                                      />
                                    </div>
                                    <span className="text-xs font-medium text-foreground w-16 text-right">{notification.opened_count || 0}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground w-16">Clicked:</span>
                                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-primary rounded-full transition-all"
                                        style={{ width: `${clickRate}%` }}
                                      />
                                    </div>
                                    <span className="text-xs font-medium text-foreground w-16 text-right">{notification.clicked_count || 0}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          
                          {sentNotifications.length === 0 && (
                            <div className="p-8 text-center">
                              <Icon name="BarChart3" size={40} color="var(--color-muted-foreground)" className="mx-auto mb-4 opacity-50" />
                              <p className="text-muted-foreground">No notification data available</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default NotificationCenter;
