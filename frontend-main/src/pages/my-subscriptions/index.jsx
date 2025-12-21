// Code will be added manually
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../components/ui/NavigationBar';
import { ToastContainer } from '../../components/ui/Toast';
import { useToast } from '../../hooks/useToast';
import Icon from '../../components/AppIcon';
import SubscriptionCard from './components/SubscriptionCard';
import SubscriptionDetailModal from './components/SubscriptionDetails';
import SearchAndFilter from './components/SearchAndFilter';
import EmptyState from './components/EmptyState';
import BulkActions from './components/BulkActions';
import YouTubePurchaseHistory from './components/YouTubePurchaseHistory';
import { historyAPI, youtubeAPI, subscriptionsAPI } from '../../services/api';

// Helper function to get platform logo
const getPlatformLogo = (platformName) => {
  const logoMap = {
    'Netflix': {
      logo: 'https://i.ibb.co/ynC8tdH9/netflixlogo.png',
      alt: 'Netflix streaming service logo'
    },
    'Amazon Prime Video': {
      logo: 'https://i.ibb.co/gFJ2YxCr/primelogo.webp',
      alt: 'Amazon Prime Video logo'
    },
    'Prime Video': {
      logo: 'https://i.ibb.co/gFJ2YxCr/primelogo.webp',
      alt: 'Amazon Prime Video logo'
    },
    'YouTube Premium': {
      logo: 'https://i.ibb.co/fdFBHghg/ytlogo.png',
      alt: 'YouTube Premium logo'
    },
    'YouTube': {
      logo: 'https://i.ibb.co/fdFBHghg/ytlogo.png',
      alt: 'YouTube Premium logo'
    },
    'Hotstar': {
      logo: 'https://i.ibb.co/8dMqgzJm/hotstarlogo.png',
      alt: 'Disney+ Hotstar logo'
    },
    'Disney+ Hotstar': {
      logo: 'https://i.ibb.co/8dMqgzJm/hotstarlogo.png',
      alt: 'Disney+ Hotstar logo'
    },
    'ZEE5': {
      logo: 'https://i.ibb.co/h8znKjJB/zee5logo.png',
      alt: 'ZEE5 streaming service logo'
    },
    'Pornhub': {
      logo: 'https://i.ibb.co/Z6VTy4Bx/phublogo.png',
      alt: 'Pornhub logo'
    },
    'Pornhub Premium': {
      logo: 'https://i.ibb.co/Z6VTy4Bx/phublogo.png',
      alt: 'Pornhub Premium logo'
    },
    'Combo Plan': {
      logo: 'https://i.ibb.co/j3LbFzQ/combo-logo.png',
      alt: 'Combo Plan logo'
    },
    'Combo': {
      logo: 'https://i.ibb.co/j3LbFzQ/combo-logo.png',
      alt: 'Combo Plan logo'
    }
  };
  
  return logoMap[platformName] || {
    logo: '/assets/images/no_image.png',
    alt: `${platformName} logo`
  };
};

const MySubscriptions = () => {
  const navigate = useNavigate();
  const { toasts, toast, removeToast } = useToast();

  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  const [user, setUser] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [youtubePurchaseData, setYoutubePurchaseData] = useState(null);
  const [isLoadingYoutube, setIsLoadingYoutube] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);

  useEffect(() => {
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
  }, []);

  // Fetch user's subscriptions
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setIsLoadingSubscriptions(true);
      const response = await subscriptionsAPI.getMySubscriptions();
      if (response?.subscriptions) {
        // Transform backend subscriptions to frontend format
        const transformedSubs = response.subscriptions.map(sub => {
          const logoInfo = getPlatformLogo(sub.platform_name);
          const isYoutube = sub.platform_name.toLowerCase().includes('youtube');
          const isCombo = sub.platform_name.toLowerCase().includes('combo');
          return {
            id: sub.id,
            platform: sub.platform_name,
            platformLogo: logoInfo.logo,
            platformLogoAlt: logoInfo.alt,
            planName: sub.plan_name,
            status: sub.status,
            purchaseDate: new Date(sub.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            expiryDate: new Date(sub.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            startDate: sub.start_date,
            endDate: sub.end_date,
            remainingDays: Math.max(0, Math.ceil((new Date(sub.end_date) - new Date()) / (1000 * 60 * 60 * 24))),
            credentials: sub.credentials,
            isYoutube: isYoutube,
            isCombo: isCombo,
            youtubeEmail: sub.youtube_email,
            youtubeEmailEditCount: sub.youtube_email_edit_count || 0,
            youtubeEmailMaxEdits: sub.youtube_email_max_edits || 1,
            price: 0, // You can add this from the product if needed
            features: [],
            isAutoRenewal: false,
            downloadLink: sub.credentials?.download_link || null
          };
        });
        setSubscriptions(transformedSubs);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast?.error('Failed to load subscriptions');
    } finally {
      setIsLoadingSubscriptions(false);
    }
  };

  // Fetch YouTube purchase history
  useEffect(() => {
    const fetchYoutubePurchase = async () => {
      try {
        setIsLoadingYoutube(true);
        const response = await historyAPI.getYouTube();
        if (response?.data) {
          setYoutubePurchaseData(response.data);
        }
      } catch (error) {
        console.error('Error fetching YouTube purchase:', error);
      } finally {
        setIsLoadingYoutube(false);
      }
    };

    fetchYoutubePurchase();
  }, []);

  const platforms = [...new Set(subscriptions.map((sub) => sub.platform))];

  const filteredSubscriptions = useMemo(() => {
    let filtered = subscriptions?.filter((sub) => {
      if (activeTab === 'active') {
        return sub?.status === 'active' || sub?.status === 'expiring_soon';
      }
      return sub?.status === 'expired';
    });

    if (searchQuery) {
      filtered = filtered?.filter((sub) =>
      sub?.platform?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      sub?.planName?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    if (selectedPlatform !== 'all') {
      filtered = filtered?.filter((sub) =>
      sub?.platform?.toLowerCase()?.replace(/\s+/g, '_') === selectedPlatform
      );
    }

    return filtered;
  }, [activeTab, searchQuery, selectedPlatform, selectedDateRange, subscriptions]);

  const activeCount = subscriptions?.filter((sub) =>
  sub?.status === 'active' || sub?.status === 'expiring_soon'
  )?.length;

  const expiredCount = subscriptions?.filter((sub) =>
  sub?.status === 'expired'
  )?.length;

  const handleViewDetails = (subscription) => {
    setSelectedSubscription(subscription);
  };

  const handleGetAccess = (subscription) => {
    if (subscription?.downloadLink) {
      window.open(subscription?.downloadLink, '_blank');
      toast?.success('Opening platform access...');
    } else {
      toast?.info('Access credentials are available in subscription details');
    }
  };

  const handleRenew = (subscription) => {
    navigate('/buy-ott-plan', { state: { platform: subscription?.platform } });
    toast?.info('Redirecting to marketplace...');
  };

  const handleExport = () => {
    toast?.success('Subscription data exported successfully');
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar
        user={user}
        walletBalance={walletBalance}
        onLogout={handleLogout} />

      <main className="pt-16 pb-20 lg:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Subscriptions</h1>
            <p className="text-muted-foreground">Manage your active and expired OTT subscriptions</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-1 mb-6 inline-flex">
            <button
              onClick={() => setActiveTab('active')}
              className={`
                px-6 py-2.5 rounded-lg text-sm font-medium transition-standard
                flex items-center gap-2
                ${activeTab === 'active' ? 'bg-primary text-primary-foreground shadow-subtle' : 'text-muted-foreground hover:text-foreground'}
              `
              }>

              <Icon name="PlaySquare" size={18} />
              <span>Active</span>
              <span className={`
                px-2 py-0.5 rounded-full text-xs font-semibold
                ${activeTab === 'active' ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'}
              `
              }>
                {activeCount}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('expired')}
              className={`
                px-6 py-2.5 rounded-lg text-sm font-medium transition-standard
                flex items-center gap-2
                ${activeTab === 'expired' ? 'bg-primary text-primary-foreground shadow-subtle' : 'text-muted-foreground hover:text-foreground'}
              `
              }>

              <Icon name="Clock" size={18} />
              <span>Expired</span>
              <span className={`
                px-2 py-0.5 rounded-full text-xs font-semibold
                ${activeTab === 'expired' ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'}
              `
              }>
                {expiredCount}
              </span>
            </button>
          </div>

          <SearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedPlatform={selectedPlatform}
            onPlatformChange={setSelectedPlatform}
            selectedDateRange={selectedDateRange}
            onDateRangeChange={setSelectedDateRange}
            platforms={platforms} />

          {/* YouTube Purchase History Section - Only show if customer has purchased */}
          {!isLoadingYoutube && youtubePurchaseData && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon name="History" size={20} color="var(--color-primary)" />
                Purchase History
              </h2>
              <YouTubePurchaseHistory toast={toast} purchaseData={youtubePurchaseData} />
            </div>
          )}

          {/* Regular Subscriptions Section */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Icon name="PlaySquare" size={20} color="var(--color-primary)" />
              My Subscriptions
            </h2>
          </div>

          {filteredSubscriptions?.length === 0 ?
          <EmptyState type={searchQuery || selectedPlatform !== 'all' ? 'search' : activeTab} /> :

          <div className="grid grid-cols-1 gap-4">
              {filteredSubscriptions?.map((subscription) =>
            <SubscriptionCard
              key={subscription?.id}
              subscription={subscription}
              onViewDetails={handleViewDetails}
              onGetAccess={handleGetAccess}
              onRenew={handleRenew} />

            )}
            </div>
          }
        </div>
      </main>
      {selectedSubscription &&
      <SubscriptionDetailModal
        subscription={selectedSubscription}
        onClose={() => setSelectedSubscription(null)}
        onUpdate={fetchSubscriptions}
        toast={toast} />

      }
      <BulkActions
        selectedCount={selectedItems?.length}
        onExport={handleExport}
        onClearSelection={() => setSelectedItems([])} />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>);

};

export default MySubscriptions;