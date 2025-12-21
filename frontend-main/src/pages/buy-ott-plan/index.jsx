import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import NavigationBar from '../../components/ui/NavigationBar';
import { ToastContainer } from '../../components/ui/Toast';
import { useToast } from '../../hooks/useToast';
import FilterPanel from './components/FilterPanel';
import PlanCard from './components/PlanCard';
import SortControls from './components/SortControls';
import PurchaseModal from './components/PurchaseModal';
import PlanSkeleton from './components/PlanSkeleton';
import EmptyState from './components/EmptyState';
import { authAPI, productsAPI, ordersAPI } from '../../services/api';

// Helper function to get platform logo
const getPlatformLogo = (platformName) => {
  const logoMap = {
    'Netflix': 'https://i.ibb.co/ynC8tdH9/netflixlogo.png',
    'Amazon Prime Video': 'https://i.ibb.co/gFJ2YxCr/primelogo.webp',
    'YouTube Premium': 'https://i.ibb.co/fdFBHghg/ytlogo.png',
    'Pornhub': 'https://i.ibb.co/Z6VTy4Bx/phublogo.png'
  };
  return logoMap[platformName] || '';
};

const BuyOTTPlan = () => {
  const navigate = useNavigate();
  const { toasts, toast, removeToast } = useToast();

  const [user, setUser] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [sortBy, setSortBy] = useState('popular');
  const [filters, setFilters] = useState({
    platform: 'all',
    duration: 'all',
    priceRange: 'all'
  });

  useEffect(() => {
    fetchUserData();
    fetchProducts();
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
      toast?.error('Failed to load user data');
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productsAPI.getAll();
      
      // Filter out unwanted platforms
      const allowedPlatforms = ['Combo Plan', 'Netflix', 'Amazon Prime Video', 'YouTube Premium', 'Pornhub'];
      const filteredProducts = response.products.filter(product => 
        allowedPlatforms.includes(product.platform_name)
      );
      
      // Transform backend products to match frontend format
      const transformedPlans = filteredProducts.map(product => {
        // Check if it's the combo plan
        const isCombo = product.platform_name === 'Combo Plan';
        
        return {
          id: product.id,
          platform: product.platform_name,
          name: product.plan_name,
          logo: isCombo ? null : getPlatformLogo(product.platform_name),
          logos: isCombo ? [
            'https://i.ibb.co/ynC8tdH9/netflixlogo.png',
            'https://i.ibb.co/gFJ2YxCr/primelogo.webp',
            'https://i.ibb.co/fdFBHghg/ytlogo.png',
            'https://i.ibb.co/Z6VTy4Bx/phublogo.png'
          ] : undefined,
          logoAlt: `${product.platform_name} logo`,
          duration: Math.floor(product.duration_days / 30),
          originalPrice: product.price * 3,
          discountedPrice: product.price,
          discount: 67,
          screens: 1,
          quality: isCombo ? '4K + HD' : 'HD',
          downloads: false,
          features: product.description.split('•').map(f => f.trim()).filter(Boolean),
          category: isCombo ? 'combo' : 'entertainment',
          popular: product.is_active && product.stock > 0,
          isCombo: isCombo
        };
      });
      
      // Sort to put combo plan first
      const sortedPlans = transformedPlans.sort((a, b) => {
        if (a.isCombo) return -1;
        if (b.isCombo) return 1;
        return 0;
      });
      
      setPlans(sortedPlans);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast?.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const getPlatformLogo = (platformName) => {
    const logos = {
      'Netflix': 'https://i.ibb.co/ynC8tdH9/netflixlogo.png',
      'Amazon Prime Video': 'https://i.ibb.co/gFJ2YxCr/primelogo.webp',
      'Disney+ Hotstar': 'https://i.ibb.co/4KNdXMN/hotstarlogo.png',
      'YouTube Premium': 'https://i.ibb.co/fdFBHghg/ytlogo.png',
      'Spotify': 'https://i.ibb.co/sJn5G4W/spotifylogo.png',
      'SonyLIV': 'https://i.ibb.co/ZM3sY4X/sonyliv-logo.png',
      'ZEE5': 'https://i.ibb.co/qN2ZG4W/zee5-logo.png'
    };
    return logos[platformName] || 'https://i.ibb.co/placeholder.png';
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      platform: 'all',
      duration: 'all',
      priceRange: 'all'
    });
    setSortBy('popular');
  };

  const getFilteredPlans = () => {
    let filtered = [...plans];

    if (filters?.platform !== 'all') {
      filtered = filtered?.filter((plan) =>
      plan?.platform?.toLowerCase()?.replace(/\+|\s/g, '') === filters?.platform
      );
    }

    if (filters?.duration !== 'all') {
      filtered = filtered?.filter((plan) =>
      plan?.duration === parseInt(filters?.duration)
      );
    }

    if (filters?.priceRange !== 'all') {
      const [min, max] = filters?.priceRange?.split('-')?.map((v) => v?.replace('+', ''));
      filtered = filtered?.filter((plan) => {
        if (max) {
          return plan?.discountedPrice >= parseFloat(min) && plan?.discountedPrice <= parseFloat(max);
        } else {
          return plan?.discountedPrice >= parseFloat(min);
        }
      });
    }

    switch (sortBy) {
      case 'price-low':
        filtered?.sort((a, b) => a?.discountedPrice - b?.discountedPrice);
        break;
      case 'price-high':
        filtered?.sort((a, b) => b?.discountedPrice - a?.discountedPrice);
        break;
      case 'savings':
        filtered?.sort((a, b) => {
          const savingsA = (a?.originalPrice - a?.discountedPrice) / a?.originalPrice * 100;
          const savingsB = (b?.originalPrice - b?.discountedPrice) / b?.originalPrice * 100;
          return savingsB - savingsA;
        });
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredPlans = getFilteredPlans();

  const handleBuyNow = (plan) => {
    setSelectedPlan(plan);
  };

  const handleConfirmPurchase = async (plan, paymentMethod) => {
    try {
      setIsProcessing(true);

      // Create order - backend handles everything (balance check, deduction, subscription creation)
      const orderResponse = await ordersAPI.create({ product_id: plan.id });

      // Refresh user data to get updated wallet balance
      await fetchUserData();

      setIsProcessing(false);
      setSelectedPlan(null);
      toast?.success(`Successfully purchased ${plan?.name} for ${plan?.platform}!`);

      // Check if it's a YouTube plan and redirect to Gmail request page
      const isYouTubePlan = plan?.platform?.toLowerCase()?.includes('youtube');
      
      setTimeout(() => {
        if (isYouTubePlan) {
          navigate('/youtube-gmail-request', {
            state: {
              orderId: orderResponse.id,
              subscriptionId: orderResponse.subscription_id,
              userId: user?.id,
              username: user?.name,
              planName: plan?.name,
              amount: plan?.discountedPrice
            }
          });
        } else {
          navigate('/my-subscriptions');
        }
      }, 1500);
    } catch (error) {
      console.error('Purchase error:', error);
      setIsProcessing(false);
      
      // Extract error message - check multiple possible formats
      let errorMessage = 'Purchase failed. Please try again.';
      
      if (error?.response?.data?.detail) {
        // If it's an axios-style error
        errorMessage = error.response.data.detail;
      } else if (error?.detail) {
        // If detail is directly on error object
        errorMessage = error.detail;
      } else if (error?.message) {
        // Standard Error.message
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast?.error(errorMessage);
    }
  };

  const handleLogout = () => {
    toast?.info('Logging out...');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar
        user={user}
        walletBalance={walletBalance}
        onLogout={handleLogout} />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="pt-16 pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Browse OTT Plans</h1>
                <p className="text-muted-foreground">
                  Discover premium subscriptions at unbeatable prices with instant access
                </p>
              </div>
              <Button
                variant="outline"
                iconName="SlidersHorizontal"
                iconPosition="left"
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden">

                Filters
              </Button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
                <Icon name="Shield" size={18} color="var(--color-primary)" />
                <span className="text-sm font-medium text-primary">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
                <Icon name="Zap" size={18} color="var(--color-primary)" />
                <span className="text-sm font-medium text-primary">Instant Access</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
                <Icon name="Headphones" size={18} color="var(--color-primary)" />
                <span className="text-sm font-medium text-primary">24/7 Support</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="hidden lg:block">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                isMobile={false}
                isOpen={false}
                onClose={() => {}}
                resultCount={filteredPlans?.length} />

            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="flex items-center justify-between">
                <SortControls sortBy={sortBy} onSortChange={setSortBy} />
              </div>

              {isLoading ?
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6]?.map((i) =>
                <PlanSkeleton key={i} />
                )}
                </div> :
              filteredPlans?.length === 0 ?
              <EmptyState onClearFilters={handleClearFilters} /> :

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredPlans?.map((plan) =>
                <PlanCard
                  key={plan?.id}
                  plan={plan}
                  onBuyNow={handleBuyNow} />

                )}
                </div>
              }
            </div>
          </div>
        </div>
      </div>
      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        isMobile={true}
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        resultCount={filteredPlans?.length} />

      {selectedPlan &&
      <PurchaseModal
        plan={selectedPlan}
        walletBalance={walletBalance}
        onClose={() => setSelectedPlan(null)}
        onConfirmPurchase={handleConfirmPurchase}
        isProcessing={isProcessing} />

      }
    </div>);

};

export default BuyOTTPlan;