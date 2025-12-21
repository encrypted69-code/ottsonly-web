import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Breadcrumb from '../../components/Breadcrumb';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import SystemHealthCard from './components/SystemHealthCard';
import AlertFeedItem from './components/AlertFeedItem';
import PerformanceChart from './components/PerformanceChart';
import ServiceStatusGrid from './components/ServiceStatusGrid';
import ConnectionStatus from './components/ConnectionStatus';
import MetricCard from './components/MetricCard';

const OperationsMonitor = () => {
  const [environment, setEnvironment] = useState('production');
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(15);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('just now');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const environmentOptions = [
    { value: 'production', label: 'Production' },
    { value: 'staging', label: 'Staging' },
    { value: 'development', label: 'Development' }
  ];

  const refreshIntervalOptions = [
    { value: 5, label: '5 seconds' },
    { value: 15, label: '15 seconds' },
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Services' },
    { value: 'api', label: 'API Services' },
    { value: 'database', label: 'Database' },
    { value: 'payment', label: 'Payment Gateway' },
    { value: 'notification', label: 'Notifications' }
  ];

  const systemHealthMetrics = [
    {
      id: 1,
      title: 'System Uptime',
      value: '99.98',
      unit: '%',
      status: 'healthy',
      icon: 'Activity',
      trend: 'up',
      trendValue: '+0.02%'
    },
    {
      id: 2,
      title: 'API Response Time',
      value: '142',
      unit: 'ms',
      status: 'healthy',
      icon: 'Zap',
      trend: 'down',
      trendValue: '-8ms'
    },
    {
      id: 3,
      title: 'Transaction Rate',
      value: '1,247',
      unit: '/min',
      status: 'healthy',
      icon: 'TrendingUp',
      trend: 'up',
      trendValue: '+12%'
    },
    {
      id: 4,
      title: 'Support Tickets',
      value: '23',
      unit: 'open',
      status: 'warning',
      icon: 'MessageSquare',
      trend: 'up',
      trendValue: '+5'
    },
    {
      id: 5,
      title: 'Notification Success',
      value: '98.7',
      unit: '%',
      status: 'healthy',
      icon: 'Bell',
      trend: 'up',
      trendValue: '+1.2%'
    },
    {
      id: 6,
      title: 'Stock Levels',
      value: '847',
      unit: 'items',
      status: 'healthy',
      icon: 'Package',
      trend: 'down',
      trendValue: '-12'
    }
  ];

  const performanceData = [
    { time: '00:00', cpu: 45, memory: 62, requests: 1200 },
    { time: '04:00', cpu: 38, memory: 58, requests: 980 },
    { time: '08:00', cpu: 72, memory: 75, requests: 2100 },
    { time: '12:00', cpu: 85, memory: 82, requests: 2850 },
    { time: '16:00', cpu: 68, memory: 71, requests: 2200 },
    { time: '20:00', cpu: 52, memory: 65, requests: 1650 },
    { time: 'Now', cpu: 58, memory: 68, requests: 1800 }
  ];

  const transactionVolumeData = [
    { time: '00:00', successful: 1150, failed: 50, pending: 20 },
    { time: '04:00', successful: 920, failed: 35, pending: 25 },
    { time: '08:00', successful: 1980, failed: 85, pending: 35 },
    { time: '12:00', successful: 2650, failed: 145, pending: 55 },
    { time: '16:00', successful: 2050, failed: 110, pending: 40 },
    { time: '20:00', successful: 1550, failed: 75, pending: 25 },
    { time: 'Now', successful: 1680, failed: 90, pending: 30 }
  ];

  const alerts = [
    {
      id: 1,
      severity: 'critical',
      title: 'High Database Latency',
      message: 'Primary database response time exceeded 500ms threshold for 3 consecutive minutes',
      source: 'Database Monitor',
      timestamp: new Date(Date.now() - 300000),
      actionable: true
    },
    {
      id: 2,
      severity: 'warning',
      title: 'Increased API Error Rate',
      message: 'Payment gateway API returning 5xx errors at 2.3% rate (threshold: 2%)',
      source: 'API Gateway',
      timestamp: new Date(Date.now() - 600000),
      actionable: true
    },
    {
      id: 3,
      severity: 'info',
      title: 'Scheduled Maintenance',
      message: 'CDN maintenance window scheduled for 02:00-04:00 UTC on December 18, 2025',
      source: 'System Admin',
      timestamp: new Date(Date.now() - 900000),
      actionable: false
    },
    {
      id: 4,
      severity: 'warning',
      title: 'Memory Usage Alert',
      message: 'Application server memory utilization at 85% (warning threshold: 80%)',
      source: 'Infrastructure',
      timestamp: new Date(Date.now() - 1200000),
      actionable: true
    },
    {
      id: 5,
      severity: 'critical',
      title: 'Failed Transaction Spike',
      message: 'Transaction failure rate increased by 45% in last 15 minutes',
      source: 'Payment Processor',
      timestamp: new Date(Date.now() - 1500000),
      actionable: true
    },
    {
      id: 6,
      severity: 'info',
      title: 'Backup Completed',
      message: 'Daily database backup completed successfully at 01:30 UTC',
      source: 'Backup Service',
      timestamp: new Date(Date.now() - 1800000),
      actionable: false
    }
  ];

  const services = [
    {
      id: 1,
      name: 'Authentication API',
      icon: 'Lock',
      status: 'operational',
      responseTime: 98,
      uptime: 99.99
    },
    {
      id: 2,
      name: 'Payment Gateway',
      icon: 'CreditCard',
      status: 'degraded',
      responseTime: 342,
      uptime: 99.85
    },
    {
      id: 3,
      name: 'Subscription Service',
      icon: 'Users',
      status: 'operational',
      responseTime: 125,
      uptime: 99.97
    },
    {
      id: 4,
      name: 'Notification Engine',
      icon: 'Bell',
      status: 'operational',
      responseTime: 87,
      uptime: 99.92
    },
    {
      id: 5,
      name: 'Content Delivery',
      icon: 'Globe',
      status: 'operational',
      responseTime: 156,
      uptime: 99.98
    },
    {
      id: 6,
      name: 'Analytics Pipeline',
      icon: 'BarChart3',
      status: 'operational',
      responseTime: 203,
      uptime: 99.94
    }
  ];

  const operationalMetrics = [
    {
      id: 1,
      title: 'Active Sessions',
      value: '12,847',
      subtitle: 'Current users online',
      icon: 'Users',
      trend: 'up',
      trendValue: '+8%',
      color: 'primary'
    },
    {
      id: 2,
      title: 'Queue Depth',
      value: '342',
      subtitle: 'Pending jobs',
      icon: 'List',
      trend: 'down',
      trendValue: '-12%',
      color: 'accent'
    },
    {
      id: 3,
      title: 'Cache Hit Rate',
      value: '94.2%',
      subtitle: 'Redis performance',
      icon: 'Database',
      trend: 'up',
      trendValue: '+2.1%',
      color: 'success'
    },
    {
      id: 4,
      title: 'Fraud Alerts',
      value: '7',
      subtitle: 'Requires review',
      icon: 'Shield',
      trend: 'up',
      trendValue: '+3',
      color: 'warning'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const seconds = Math.floor((Date.now() - now?.setSeconds(now?.getSeconds() - 30)) / 1000);
      setLastUpdate(`${seconds}s ago`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAlertAction = (alertId) => {
    console.log('Investigating alert:', alertId);
  };

  const handleExportMetrics = () => {
    console.log('Exporting operational metrics');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="lg:ml-60 pt-24">
        <div className="p-6">
          <Breadcrumb />
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Operations Monitor</h1>
              <p className="text-muted-foreground">Real-time system performance and operational health monitoring</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <Select
                options={environmentOptions}
                value={environment}
                onChange={setEnvironment}
                className="w-40"
              />
              <Select
                options={refreshIntervalOptions}
                value={autoRefreshInterval}
                onChange={setAutoRefreshInterval}
                className="w-40"
              />
              <Button variant="outline" iconName="Download" onClick={handleExportMetrics}>
                Export
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <ConnectionStatus
              isConnected={isConnected}
              lastUpdate={lastUpdate}
              autoRefreshInterval={autoRefreshInterval}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            {systemHealthMetrics?.map((metric) => (
              <SystemHealthCard key={metric?.id} {...metric} />
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            <div className="xl:col-span-2 space-y-6">
              <PerformanceChart
                title="System Resource Utilization"
                data={performanceData}
                type="line"
                dataKeys={['cpu', 'memory']}
                colors={['var(--color-primary)', 'var(--color-accent)']}
                height={300}
              />
              
              <PerformanceChart
                title="Transaction Volume"
                data={transactionVolumeData}
                type="bar"
                dataKeys={['successful', 'failed', 'pending']}
                colors={['var(--color-success)', 'var(--color-error)', 'var(--color-warning)']}
                height={300}
              />
            </div>

            <div className="bg-card border border-border rounded-lg p-4 h-fit max-h-[650px] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-card pb-2">
                <h3 className="text-sm font-semibold text-card-foreground">Alert Feed</h3>
                <Select
                  options={[
                    { value: 'all', label: 'All Alerts' },
                    { value: 'critical', label: 'Critical' },
                    { value: 'warning', label: 'Warning' }
                  ]}
                  value="all"
                  onChange={() => {}}
                  className="w-32"
                />
              </div>
              <div>
                {alerts?.map((alert) => (
                  <AlertFeedItem key={alert?.id} alert={alert} onAction={handleAlertAction} />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {operationalMetrics?.map((metric) => (
              <MetricCard key={metric?.id} {...metric} />
            ))}
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Platform Services</h2>
              <Select
                options={filterOptions}
                value={selectedFilter}
                onChange={setSelectedFilter}
                className="w-48"
              />
            </div>
            <ServiceStatusGrid services={services} />
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-card-foreground">Fraud Detection Statistics</h3>
              <Button variant="ghost" iconName="ExternalLink" size="sm">
                View Details
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-background border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Flagged Transactions</span>
                  <span className="text-xs font-medium text-warning">Medium Risk</span>
                </div>
                <p className="text-2xl font-bold text-card-foreground">47</p>
                <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
              </div>
              <div className="bg-background border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Blocked Attempts</span>
                  <span className="text-xs font-medium text-error">High Risk</span>
                </div>
                <p className="text-2xl font-bold text-card-foreground">12</p>
                <p className="text-xs text-muted-foreground mt-1">Prevented losses: $8,450</p>
              </div>
              <div className="bg-background border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">False Positives</span>
                  <span className="text-xs font-medium text-success">Low Impact</span>
                </div>
                <p className="text-2xl font-bold text-card-foreground">3</p>
                <p className="text-xs text-muted-foreground mt-1">Accuracy: 97.8%</p>
              </div>
              <div className="bg-background border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Under Review</span>
                  <span className="text-xs font-medium text-accent">Pending</span>
                </div>
                <p className="text-2xl font-bold text-card-foreground">7</p>
                <p className="text-xs text-muted-foreground mt-1">Avg review time: 18min</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OperationsMonitor;