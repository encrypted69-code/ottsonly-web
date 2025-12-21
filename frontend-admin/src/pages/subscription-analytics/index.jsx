import React, { useState } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Breadcrumb from '../../components/Breadcrumb';
import MetricCard from './components/MetricCard';
import SubscriptionFunnel from './components/SubscriptionFunnel';
import ChurnPrediction from './components/ChurnPrediction';
import CohortRetention from './components/CohortRetention';
import PlanPopularity from './components/PlanPopularity';
import FilterPanel from './components/FilterPanel';
import PlatformCard from './components/PlatformCard';
import AddPlatformCard from './components/AddPlatformCard';
import EditPlatformModal from './components/EditPlatformModal';

const SubscriptionAnalytics = () => {
  const [filters, setFilters] = useState({
    plan: 'all',
    cohort: 'monthly',
    channel: 'all',
    demographic: 'all'
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  const [platforms, setPlatforms] = useState([
    {
      id: 1,
      platform: "Netflix",
      logo: "https://i.ibb.co/ynC8tdH9/netflixlogo.png",
      logoAlt: "Netflix logo",
      description: "Premium Plan - 4K + HDR",
      stocks: 99,
      price: 89
    },
    {
      id: 2,
      platform: "YouTube",
      logo: "https://i.ibb.co/fdFBHghg/ytlogo.png",
      logoAlt: "YouTube Premium logo",
      description: "Individual Plan - No Ads",
      stocks: 150,
      price: 15
    },
    {
      id: 3,
      platform: "Pornhub",
      logo: "https://i.ibb.co/r2YZ36Sc/phublogo.png",
      logoAlt: "Pornhub logo",
      description: "Premium Plan - All Content",
      stocks: 75,
      price: 69
    },
    {
      id: 4,
      platform: "Prime Video",
      logo: "https://i.ibb.co/gFJ2YxCr/primelogo.webp",
      logoAlt: "Prime Video logo",
      description: "Monthly Plan - HD 1080p",
      stocks: 120,
      price: 35
    }
  ]);

  const handleEditClick = (platform) => {
    setSelectedPlatform(platform);
    setIsEditModalOpen(true);
  };

  const handleSavePlatform = (updatedPlatform) => {
    setPlatforms(prev => 
      prev.map(p => p.id === updatedPlatform.id ? updatedPlatform : p)
    );
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedPlatform(null);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    console.log('Applying filters:', filters);
  };

  const handleResetFilters = () => {
    setFilters({
      plan: 'all',
      cohort: 'monthly',
      channel: 'all',
      demographic: 'all'
    });
  };

  const metricsData = [
    {
      title: 'Conversion Rate',
      value: '24.8%',
      change: '+3.2%',
      changeType: 'positive',
      icon: 'TrendingUp',
      trend: 'vs last period'
    },
    {
      title: 'Renewal Rate',
      value: '87.3%',
      change: '+1.8%',
      changeType: 'positive',
      icon: 'RefreshCw',
      trend: 'vs last period'
    },
    {
      title: 'Upgrade Ratio',
      value: '18.5%',
      change: '-2.1%',
      changeType: 'negative',
      icon: 'ArrowUpCircle',
      trend: 'vs last period'
    },
    {
      title: 'Avg Duration',
      value: '8.4 mo',
      change: '+0.6 mo',
      changeType: 'positive',
      icon: 'Clock',
      trend: 'vs last period'
    }
  ];

  const funnelData = [
    { stage: 'Website Visitors', users: 125000, conversion: 100 },
    { stage: 'Sign-ups', users: 45000, conversion: 36 },
    { stage: 'Trial Started', users: 32000, conversion: 25.6 },
    { stage: 'Active Subscribers', users: 24000, conversion: 19.2 },
    { stage: 'Renewed Subscribers', users: 18500, conversion: 14.8 }
  ];

  const churnPredictions = [
    {
      id: 1,
      segment: 'Premium Netflix Users',
      severity: 'high',
      riskScore: 78,
      description: 'High engagement drop in last 30 days with payment method expiring soon',
      affectedUsers: 1247,
      timeframe: 'Next 15 days'
    },
    {
      id: 2,
      segment: 'Prime Video Basic',
      severity: 'medium',
      riskScore: 54,
      description: 'Decreased viewing frequency and content interaction patterns',
      affectedUsers: 892,
      timeframe: 'Next 30 days'
    },
    {
      id: 3,
      segment: 'Disney+ Family Plans',
      severity: 'low',
      riskScore: 32,
      description: 'Seasonal usage patterns detected, normal retention expected',
      affectedUsers: 456,
      timeframe: 'Next 45 days'
    },
    {
      id: 4,
      segment: 'Hotstar Sports Subscribers',
      severity: 'high',
      riskScore: 82,
      description: 'Major sports season ending, high churn risk without content refresh',
      affectedUsers: 2134,
      timeframe: 'Next 7 days'
    }
  ];

  const cohortData = [
    {
      cohortName: 'Jan 2024',
      months: [100, 85, 78, 72, 68, 65, 62, 60],
      users: [5000, 4250, 3900, 3600, 3400, 3250, 3100, 3000]
    },
    {
      cohortName: 'Feb 2024',
      months: [100, 88, 82, 76, 71, 68, 65],
      users: [5200, 4576, 4264, 3952, 3692, 3536, 3380]
    },
    {
      cohortName: 'Mar 2024',
      months: [100, 90, 84, 79, 75, 72],
      users: [5500, 4950, 4620, 4345, 4125, 3960]
    },
    {
      cohortName: 'Apr 2024',
      months: [100, 92, 86, 81, 77],
      users: [5800, 5336, 4988, 4698, 4466]
    },
    {
      cohortName: 'May 2024',
      months: [100, 91, 85, 80],
      users: [6000, 5460, 5100, 4800]
    },
    {
      cohortName: 'Jun 2024',
      months: [100, 89, 83],
      users: [6200, 5518, 5146]
    },
    {
      cohortName: 'Jul 2024',
      months: [100, 87],
      users: [6400, 5568]
    },
    {
      cohortName: 'Aug 2024',
      months: [100],
      users: [6600]
    }
  ];

  const planPopularityData = [
    { month: 'Jan', Netflix: 12500, 'Prime Video': 10800, 'Disney+': 8200, Hotstar: 6500 },
    { month: 'Feb', Netflix: 13200, 'Prime Video': 11400, 'Disney+': 8800, Hotstar: 6900 },
    { month: 'Mar', Netflix: 14100, 'Prime Video': 12200, 'Disney+': 9500, Hotstar: 7400 },
    { month: 'Apr', Netflix: 14800, 'Prime Video': 12800, 'Disney+': 10100, Hotstar: 7800 },
    { month: 'May', Netflix: 15600, 'Prime Video': 13500, 'Disney+': 10800, Hotstar: 8300 },
    { month: 'Jun', Netflix: 16200, 'Prime Video': 14100, 'Disney+': 11400, Hotstar: 8700 },
    { month: 'Jul', Netflix: 16900, 'Prime Video': 14800, 'Disney+': 12100, Hotstar: 9200 },
    { month: 'Aug', Netflix: 17500, 'Prime Video': 15400, 'Disney+': 12700, Hotstar: 9600 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="lg:ml-60 pt-24">
        <div className="p-6 lg:p-8">
          <Breadcrumb />
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Subscription Analytics</h1>
            <p className="text-muted-foreground">Monitor subscription lifecycle performance and predict customer behavior patterns</p>
          </div>

          <FilterPanel 
            filters={filters}
            onFilterChange={handleFilterChange}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />

          <div className="space-y-4 mt-8">
            {platforms.map((platform) => (
              <PlatformCard 
                key={platform.id}
                platform={platform.platform}
                logo={platform.logo}
                logoAlt={platform.logoAlt}
                description={platform.description}
                onEdit={() => handleEditClick(platform)}
              />
            ))}
            <AddPlatformCard onClick={() => handleEditClick(null)} />
          </div>
        </div>
      </main>

      <EditPlatformModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        platform={selectedPlatform}
        onSave={handleSavePlatform}
      />
    </div>
  );
};

export default SubscriptionAnalytics;