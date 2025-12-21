import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Breadcrumb from '../../components/Breadcrumb';
import KPICard from './components/KPICard';
import RevenueChart from './components/RevenueChart';
import GeographicMap from './components/GeographicMap';
import PlatformBreakdown from './components/PlatformBreakdown';
import MetricsStrip from './components/MetricsStrip';

const ExecutiveDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const kpiData = [
    {
      title: "Monthly Recurring Revenue",
      value: "₹847,250",
      change: "+12.5%",
      changeType: "positive",
      icon: "DollarSign",
      trend: [45, 52, 48, 65, 72, 68, 85, 92, 88, 95, 100, 98]
    },
    {
      title: "Total Active Subscriptions",
      value: "24,847",
      change: "+8.3%",
      changeType: "positive",
      icon: "Users",
      trend: [55, 58, 62, 65, 70, 68, 75, 80, 85, 88, 92, 100]
    },
    {
      title: "Customer Acquisition Cost",
      value: "₹34.20",
      change: "-5.2%",
      changeType: "positive",
      icon: "TrendingDown",
      trend: [100, 95, 92, 88, 85, 82, 78, 75, 72, 68, 65, 60]
    },
    {
      title: "Churn Rate",
      value: "2.8%",
      change: "+0.3%",
      changeType: "negative",
      icon: "AlertCircle",
      trend: [40, 42, 45, 48, 52, 50, 55, 58, 60, 62, 65, 68]
    }
  ];

  const revenueChartData = [
    { month: "Jan", revenue: 645000, users: 18500 },
    { month: "Feb", revenue: 682000, users: 19200 },
    { month: "Mar", revenue: 715000, users: 20100 },
    { month: "Apr", revenue: 748000, users: 21300 },
    { month: "May", revenue: 782000, users: 22400 },
    { month: "Jun", revenue: 810000, users: 23600 },
    { month: "Jul", revenue: 847250, users: 24847 }
  ];

  const geographicData = [
    { name: "North America", revenue: 342500, users: 9850 },
    { name: "Europe", revenue: 285400, users: 8120 },
    { name: "Asia Pacific", revenue: 156800, users: 4680 },
    { name: "Latin America", revenue: 42350, users: 1520 },
    { name: "Middle East & Africa", revenue: 20200, users: 677 }
  ];

  const platformData = [
    { name: "Netflix", value: 8945, percentage: 36 },
    { name: "Amazon Prime", value: 7215, percentage: 29 },
    { name: "Disney+", value: 4968, percentage: 20 },
    { name: "HBO Max", value: 2485, percentage: 10 },
    { name: "Others", value: 1234, percentage: 5 }
  ];

  const metricsData = [
    {
      label: "Daily Active Users",
      value: "18,542",
      change: "+6.2%",
      trend: "up",
      icon: "Activity",
      sparkline: [45, 52, 48, 65, 72, 68, 85, 92, 88, 95, 100, 98, 95, 100]
    },
    {
      label: "Average Revenue Per User",
      value: "$34.12",
      change: "+3.8%",
      trend: "up",
      icon: "DollarSign",
      sparkline: [60, 65, 62, 70, 75, 72, 80, 85, 82, 88, 92, 90, 95, 100]
    },
    {
      label: "Customer Lifetime Value",
      value: "$1,248",
      change: "+11.5%",
      trend: "up",
      icon: "TrendingUp",
      sparkline: [50, 55, 58, 62, 68, 72, 75, 80, 85, 88, 92, 95, 98, 100]
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="lg:ml-60 pt-24">
        <div className="p-6 lg:p-8">
          <Breadcrumb />

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Executive Dashboard</h1>
            <p className="text-muted-foreground">
              Strategic overview of OTTSONLY platform performance and key business metrics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiData?.map((kpi, index) => (
              <KPICard key={index} {...kpi} />
            ))}
          </div>

          {/* Other dashboard cards removed */}
        </div>
      </main>
    </div>
  );
};

export default ExecutiveDashboard;