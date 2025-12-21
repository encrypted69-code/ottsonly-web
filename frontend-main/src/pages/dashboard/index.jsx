// Code will be added manually
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import NavigationBar from '../../components/ui/NavigationBar';
import { authAPI } from '../../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [user, setUser] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [subscriptionsCount, setSubscriptionsCount] = useState(0);
  const [totalSpending, setTotalSpending] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Fetch fresh user data from API
      const response = await authAPI.getProfile();
      
      // Update localStorage with fresh data
      localStorage.setItem('user', JSON.stringify(response));
      
      setUser(response);
      setWalletBalance(response.wallet_balance || 0);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback to localStorage if API fails
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setWalletBalance(parsedUser.wallet_balance || 0);
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    const hour = new Date()?.getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 17) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  const stats = [
    {
      id: 1,
      title: "Active Subscriptions",
      value: subscriptionsCount.toString(),
      change: subscriptionsCount > 0 ? `${subscriptionsCount} active` : "No subscriptions yet",
      icon: "TrendingUp",
      iconBg: "bg-primary/10",
      iconColor: "var(--color-primary)"
    },
    {
      id: 2,
      title: "Wallet Balance",
      value: `₹${walletBalance?.toFixed(2)}`,
      change: walletBalance > 0 ? "Ready to use" : "Add funds to get started",
      icon: "Wallet",
      iconBg: "bg-success/10",
      iconColor: "var(--color-success)"
    },
    {
      id: 3,
      title: "Total Savings",
      value: `₹${totalSavings.toFixed(2)}`,
      change: totalSavings > 0 ? "From discounts" : "Start saving today",
      icon: "PiggyBank",
      iconBg: "bg-warning/10",
      iconColor: "var(--color-warning)"
    },
    {
      id: 4,
      title: "This Month Spending",
      value: `₹${totalSpending.toFixed(2)}`,
      change: totalSpending > 0 ? "This month" : "No spending yet",
      icon: "DollarSign",
      iconBg: "bg-error/10",
      iconColor: "var(--color-error)"
    }
  ];


  const featuredPlatforms = [
  {
    name: 'Netflix',
    logo: 'https://i.ibb.co/ynC8tdH9/netflixlogo.png',
    logoAlt: 'Netflix streaming service logo with red background',
    discount: '70% OFF',
    startingPrice: '₹89'
  },
  {
    name: 'Prime Video',
    logo: "https://i.ibb.co/gFJ2YxCr/primelogo.webp",
    logoAlt: 'Amazon Prime Video logo with blue background',
    discount: '65% OFF',
    startingPrice: '₹35'
  },
  {
    name: 'Pornhub',
    logo: 'https://i.ibb.co/Z6VTy4Bx/phublogo.png',
    logoAlt: 'Pornhub logo',
    discount: '60% OFF',
    startingPrice: '₹69'
  },
  {
    name: 'YouTube Premium',
    logo: "https://i.ibb.co/fdFBHghg/ytlogo.png",
    logoAlt: 'YouTube Premium logo with red play button',
    discount: '55% OFF',
    startingPrice: '₹15'
  }];


  const quickActions = [
  {
    title: 'Buy OTT Plans',
    description: 'Browse and purchase new subscriptions',
    icon: 'ShoppingCart',
    color: 'primary',
    path: '/buy-ott-plan',
    bgColor: 'bg-primary/10',
    iconColor: 'var(--color-primary)'
  },
  {
    title: 'My Subscriptions',
    description: 'View and manage your active plans',
    icon: 'Tv',
    color: 'success',
    path: '/my-subscriptions',
    bgColor: 'bg-green-500/10',
    iconColor: '#22c55e'
  },
  {
    title: 'Wallet & Payments',
    description: 'Add money and view transactions',
    icon: 'Wallet',
    color: 'warning',
    path: '/wallet-and-payments',
    bgColor: 'bg-yellow-500/10',
    iconColor: '#eab308'
  }];

  const recentActivity = [
  {
    type: 'info',
    icon: 'Info',
    title: 'Welcome to OTTSONLY!',
    description: 'Get started by browsing our exclusive OTT plans with up to 70% discount.',
    time: 'Just now',
    color: 'primary'
  }];


  return (
    <>
      <Helmet>
        <title>Dashboard - OTTSONLY | Manage Your OTT Subscriptions</title>
        <meta name="description" content="Access your OTTSONLY dashboard to manage subscriptions, wallet, and explore exclusive OTT deals." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <NavigationBar user={user} walletBalance={walletBalance} onLogout={handleLogout} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <a 
                  href="https://t.me/ottsonly01" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group px-4 py-2.5 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:shadow-[0_0_30px_rgba(34,197,94,0.7)] transition-all"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[#2AABEE] to-[#229ED9] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                    <span className="text-2xl">📱</span>
                  </div>
                  <span className="text-base font-semibold text-foreground group-hover:text-[#2AABEE] transition-colors" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Customer Reviews
                  </span>
                </a>

                <a 
                  href="https://t.me/Ottsonly1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group px-4 py-2.5 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] transition-all"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                    <span className="text-2xl">🎧</span>
                  </div>
                  <span className="text-base font-semibold text-foreground group-hover:text-[#10B981] transition-colors" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Support
                  </span>
                </a>
              </div>
              <Button
                onClick={() => navigate('/buy-ott-plan')}
                iconName="Plus"
                iconPosition="left">

                Buy New Plan
              </Button>
            </div>
          </div>

          {/* Featured Platforms */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Featured Platforms</h2>
              <Button
                variant="ghost"
                onClick={() => navigate('/buy-ott-plan')}
                iconName="ArrowRight"
                iconPosition="right">

                View All
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredPlatforms?.map((platform, index) =>
              <div
                key={index}
                onClick={() => navigate('/buy-ott-plan')}
                className="bg-card border border-border rounded-xl p-4 hover:border-primary hover:shadow-prominent transition-standard cursor-pointer group">

                  <div className="aspect-square rounded-lg overflow-hidden mb-4 group-hover:scale-105 transition-standard">
                    <Image
                    src={platform?.logo}
                    alt={platform?.logoAlt}
                    className="w-full h-full object-cover" />

                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">{platform?.name}</h3>
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                        {platform?.discount}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Starting at <span className="font-bold text-foreground">{platform?.startingPrice}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions?.map((action, index) =>
              <button
                key={index}
                onClick={() => navigate(action?.path)}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary hover:shadow-prominent transition-standard text-left group">

                  <div className={`w-12 h-12 ${action?.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-standard`}>
                    <Icon name={action?.icon} size={24} color={action?.iconColor} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{action?.title}</h3>
                  <p className="text-sm text-muted-foreground">{action?.description}</p>
                </button>
              )}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            {stats?.map((stat, index) =>
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-prominent transition-standard">

                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat?.iconBg} rounded-lg flex items-center justify-center`}>
                    <Icon name={stat?.icon} size={24} color={stat?.iconColor || 'var(--color-primary)'} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">{stat?.value}</h3>
                <p className="text-sm font-medium text-foreground mb-1">{stat?.title}</p>
                <p className="text-xs text-muted-foreground">{stat?.change}</p>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity?.map((activity, index) =>
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-4 flex items-start gap-4">

                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name={activity?.icon} size={20} color="var(--color-primary)" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{activity?.title}</h4>
                        <p className="text-sm text-muted-foreground">{activity?.description}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{activity?.time}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Support Section */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Headphones" size={24} color="var(--color-primary)" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Need Help?</h3>
                  <p className="text-sm text-muted-foreground">
                    Our support team is available 24/7 to assist you
                  </p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/landing-page')}
                variant="default"
                iconName="MessageCircle"
                iconPosition="left">

                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>);

};

export default Dashboard;