import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Breadcrumb from '../../components/Breadcrumb';
import MetricCard from './components/MetricCard';
import RevenueWaterfallChart from './components/RevenueWaterfallChart';
import PaymentMethodRankings from './components/PaymentMethodRankings';
import FraudAlerts from './components/FraudAlerts';
import TransactionHeatmap from './components/TransactionHeatmap';
import WalletTransactionFlow from './components/WalletTransactionFlow';
import RevenuePlatformComparison from './components/RevenuePlatformComparison';
import FilterControls from './components/FilterControls';

const RevenueIntelligence = () => {
  const [currency, setCurrency] = useState('USD');
  const [paymentMethod, setPaymentMethod] = useState('all');
  const [fiscalPeriod, setFiscalPeriod] = useState('current_month');
  const [dataMode, setDataMode] = useState('realtime');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const topMetrics = [
    {
      title: 'Total Revenue',
      value: '$2.4M',
      change: '+18.2%',
      changeType: 'positive',
      icon: 'DollarSign',
      iconColor: 'bg-success/20 text-success',
      trend: '+$324K this week'
    },
    {
      title: 'Payment Success Rate',
      value: '96.8%',
      change: '+2.1%',
      changeType: 'positive',
      icon: 'CheckCircle',
      iconColor: 'bg-primary/20 text-primary',
      trend: '98.2% peak today'
    },
    {
      title: 'Avg Transaction Value',
      value: '$47.32',
      change: '+5.4%',
      changeType: 'positive',
      icon: 'TrendingUp',
      iconColor: 'bg-accent/20 text-accent',
      trend: '$52.10 highest'
    },
    {
      title: 'Refund Rate',
      value: '2.3%',
      change: '-0.8%',
      changeType: 'positive',
      icon: 'AlertTriangle',
      iconColor: 'bg-warning/20 text-warning',
      trend: '1.9% target achieved'
    }
  ];

  const waterfallData = [
    { 
      name: 'Jan', 
      value: 185000, 
      color: '#22C55E',
      breakdown: [
        { label: 'Netflix', value: 75000 },
        { label: 'Prime Video', value: 62000 },
        { label: 'Disney+', value: 48000 }
      ]
    },
    { 
      name: 'Feb', 
      value: 198000, 
      color: '#16A34A',
      breakdown: [
        { label: 'Netflix', value: 82000 },
        { label: 'Prime Video', value: 68000 },
        { label: 'Disney+', value: 48000 }
      ]
    },
    { 
      name: 'Mar', 
      value: 215000, 
      color: '#22C55E',
      breakdown: [
        { label: 'Netflix', value: 88000 },
        { label: 'Prime Video', value: 72000 },
        { label: 'Disney+', value: 55000 }
      ]
    },
    { 
      name: 'Apr', 
      value: 232000, 
      color: '#16A34A',
      breakdown: [
        { label: 'Netflix', value: 95000 },
        { label: 'Prime Video', value: 78000 },
        { label: 'Disney+', value: 59000 }
      ]
    },
    { 
      name: 'May', 
      value: 248000, 
      color: '#22C55E',
      breakdown: [
        { label: 'Netflix', value: 102000 },
        { label: 'Prime Video', value: 84000 },
        { label: 'Disney+', value: 62000 }
      ]
    },
    { 
      name: 'Jun', 
      value: 265000, 
      color: '#16A34A',
      breakdown: [
        { label: 'Netflix', value: 108000 },
        { label: 'Prime Video', value: 89000 },
        { label: 'Disney+', value: 68000 }
      ]
    }
  ];

  const paymentMethods = [
    {
      id: 1,
      name: 'Credit Card',
      icon: 'CreditCard',
      revenue: 1245000,
      transactions: '28,450',
      successRate: 97.2,
      percentage: 52
    },
    {
      id: 2,
      name: 'UPI',
      icon: 'Smartphone',
      revenue: 685000,
      transactions: '18,230',
      successRate: 96.8,
      percentage: 29
    },
    {
      id: 3,
      name: 'Debit Card',
      icon: 'CreditCard',
      revenue: 325000,
      transactions: '9,840',
      successRate: 95.4,
      percentage: 14
    },
    {
      id: 4,
      name: 'Net Banking',
      icon: 'Building',
      revenue: 145000,
      transactions: '3,120',
      successRate: 94.1,
      percentage: 6
    }
  ];

  const fraudAlerts = [
    {
      id: 1,
      severity: 'critical',
      title: 'Multiple Failed Transactions',
      description: 'User ID #45892 attempted 8 transactions in 2 minutes from different locations',
      timestamp: '2 minutes ago'
    },
    {
      id: 2,
      severity: 'high',
      title: 'Unusual Transaction Pattern',
      description: 'Spike in high-value transactions ($500+) from new accounts in last hour',
      timestamp: '15 minutes ago'
    },
    {
      id: 3,
      severity: 'medium',
      title: 'Card Testing Detected',
      description: 'Multiple small-value transactions detected from same IP address',
      timestamp: '1 hour ago'
    },
    {
      id: 4,
      severity: 'high',
      title: 'Chargeback Alert',
      description: '3 chargebacks received for transactions processed yesterday',
      timestamp: '2 hours ago'
    }
  ];

  const heatmapData = [
    {
      day: 'Mon',
      hours: [15, 18, 22, 28, 35, 42, 55, 68, 75, 82, 88, 92, 85, 78, 72, 68, 75, 82, 88, 85, 72, 58, 42, 28]
    },
    {
      day: 'Tue',
      hours: [12, 16, 20, 25, 32, 38, 48, 62, 72, 78, 85, 90, 88, 82, 75, 70, 78, 85, 90, 88, 75, 62, 45, 30]
    },
    {
      day: 'Wed',
      hours: [14, 18, 24, 30, 38, 45, 58, 70, 78, 85, 90, 95, 92, 85, 78, 72, 80, 88, 92, 90, 78, 65, 48, 32]
    },
    {
      day: 'Thu',
      hours: [16, 20, 26, 32, 40, 48, 60, 72, 80, 88, 92, 96, 94, 88, 82, 75, 82, 90, 94, 92, 80, 68, 52, 35]
    },
    {
      day: 'Fri',
      hours: [18, 22, 28, 35, 42, 52, 65, 78, 85, 92, 96, 98, 96, 92, 88, 82, 88, 94, 98, 96, 88, 75, 58, 40]
    },
    {
      day: 'Sat',
      hours: [20, 25, 32, 40, 48, 58, 70, 82, 90, 95, 98, 100, 98, 95, 92, 88, 92, 96, 100, 98, 92, 80, 65, 45]
    },
    {
      day: 'Sun',
      hours: [22, 28, 35, 42, 50, 60, 72, 85, 92, 96, 100, 100, 100, 98, 95, 90, 95, 98, 100, 100, 95, 85, 70, 50]
    }
  ];

  const walletFlowData = [
    { date: 'Jan 1', credits: 45000, debits: 32000, balance: 13000 },
    { date: 'Jan 8', credits: 52000, debits: 38000, balance: 27000 },
    { date: 'Jan 15', credits: 48000, debits: 35000, balance: 40000 },
    { date: 'Jan 22', credits: 58000, debits: 42000, balance: 56000 },
    { date: 'Jan 29', credits: 62000, debits: 45000, balance: 73000 },
    { date: 'Feb 5', credits: 68000, debits: 48000, balance: 93000 },
    { date: 'Feb 12', credits: 72000, debits: 52000, balance: 113000 }
  ];

  const platformComparisonData = [
    { platform: 'Netflix', revenue: 485000, subscriptions: 8420 },
    { platform: 'Prime Video', revenue: 398000, subscriptions: 7850 },
    { platform: 'Disney+', revenue: 312000, subscriptions: 6240 },
    { platform: 'HBO Max', revenue: 245000, subscriptions: 4180 },
    { platform: 'Apple TV+', revenue: 198000, subscriptions: 3520 },
    { platform: 'Hulu', revenue: 165000, subscriptions: 2980 }
  ];

  const handleRefresh = () => {
    setLastRefresh(new Date());
    console.log('Data refreshed at:', new Date()?.toLocaleTimeString());
  };

  useEffect(() => {
    if (dataMode === 'realtime') {
      const interval = setInterval(() => {
        setLastRefresh(new Date());
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [dataMode]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="lg:ml-60 pt-24">
        <div className="p-6 lg:p-8">
          <Breadcrumb />
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Revenue Intelligence</h1>
            <p className="text-muted-foreground">
              Comprehensive financial analytics and transaction monitoring
              {dataMode === 'realtime' && (
                <span className="ml-2 text-xs text-success">
                  • Live (Updated {lastRefresh?.toLocaleTimeString()})
                </span>
              )}
            </p>
          </div>

          <FilterControls
            currency={currency}
            setCurrency={setCurrency}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            fiscalPeriod={fiscalPeriod}
            setFiscalPeriod={setFiscalPeriod}
            dataMode={dataMode}
            setDataMode={setDataMode}
            onRefresh={handleRefresh}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
            {topMetrics?.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            <div className="xl:col-span-2">
              <RevenueWaterfallChart data={waterfallData} />
            </div>
            <div className="space-y-6">
              <PaymentMethodRankings methods={paymentMethods} />
              <FraudAlerts alerts={fraudAlerts} />
            </div>
          </div>

          <div className="mb-6">
            <TransactionHeatmap data={heatmapData} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <WalletTransactionFlow data={walletFlowData} />
            <RevenuePlatformComparison data={platformComparisonData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default RevenueIntelligence;