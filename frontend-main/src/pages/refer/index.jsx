import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import NavigationBar from '../../components/ui/NavigationBar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { referralAPI, authAPI } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/ui/Toast';

const Refer = () => {
  const navigate = useNavigate();
  const { toasts, toast, removeToast } = useToast();
  
  const [user, setUser] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [bankDetails, setBankDetails] = useState({
    account_number: '',
    ifsc_code: '',
    account_holder_name: ''
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchDashboard();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response);
      setWalletBalance(response.main_wallet_balance || 0);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await referralAPI.getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching referral dashboard:', error);
      toast?.error(error.message || 'Failed to load referral data');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    if (dashboardData?.referral_code) {
      navigator.clipboard.writeText(dashboardData.referral_code);
      toast?.success('Referral code copied to clipboard!');
    }
  };

  const copyReferralLink = () => {
    if (dashboardData?.referral_code) {
      const referralLink = `${window.location.origin}/registration?ref=${dashboardData.referral_code}`;
      navigator.clipboard.writeText(referralLink);
      toast?.success('Referral link copied to clipboard!');
    }
  };

  const handleWithdrawRequest = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast?.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(withdrawAmount) < 100) {
      toast?.error('Minimum withdrawal amount is ₹100');
      return;
    }

    if (parseFloat(withdrawAmount) > (dashboardData?.withdrawable_balance || 0)) {
      toast?.error('Insufficient withdrawable balance');
      return;
    }

    if (!upiId || !upiId.trim()) {
      toast?.error('Please enter UPI ID');
      return;
    }

    try {
      setProcessing(true);
      await referralAPI.requestWithdrawal({
        amount: parseFloat(withdrawAmount),
        upi_id: upiId.trim()
      });
      
      toast?.success('Withdrawal request submitted successfully');
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      setUpiId('');
      setBankDetails({ account_number: '', ifsc_code: '', account_holder_name: '' });
      fetchDashboard();
    } catch (error) {
      toast?.error(error.message || 'Failed to submit withdrawal request');
    } finally {
      setProcessing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Refer & Earn - OTTSONLY</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          <NavigationBar user={user} walletBalance={walletBalance} onLogout={handleLogout} />
          <main className="pt-24 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading referral data...</p>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Refer & Earn - OTTSONLY</title>
        <meta name="description" content="Refer friends and earn 10% commission on OTTSONLY" />
      </Helmet>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="min-h-screen bg-background">
        <NavigationBar user={user} walletBalance={walletBalance} onLogout={handleLogout} />

        <main className="pt-24 pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Referral Program</h1>
              <p className="text-muted-foreground">
                Earn {dashboardData?.commission_rate || 10}% commission on every wallet recharge by your referrals
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Icon name="Users" size={20} color="#3b82f6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Referrals</p>
                    <p className="text-2xl font-bold text-foreground">{dashboardData?.total_referrals || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Icon name="UserCheck" size={20} color="#22c55e" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Referrals</p>
                    <p className="text-2xl font-bold text-foreground">{dashboardData?.active_referrals || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <Icon name="TrendingUp" size={20} color="#eab308" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                    <p className="text-2xl font-bold text-foreground">₹{dashboardData?.total_earnings?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Icon name="Wallet" size={20} color="#a855f7" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Available Balance</p>
                    <p className="text-2xl font-bold text-foreground">₹{dashboardData?.withdrawable_balance?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Code Section */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Your Referral Code</h2>
                <div className="bg-background rounded-lg p-4 mb-4">
                  <p className="text-3xl font-bold text-center text-primary tracking-wider">
                    {dashboardData?.referral_code || 'Loading...'}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={copyReferralCode}
                    className="flex-1"
                    variant="outline"
                  >
                    <Icon name="Copy" size={18} className="mr-2" />
                    Copy Code
                  </Button>
                  <Button
                    onClick={copyReferralLink}
                    className="flex-1"
                  >
                    <Icon name="Share2" size={18} className="mr-2" />
                    Share Link
                  </Button>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Withdraw Earnings</h2>
                <p className="text-muted-foreground mb-4">
                  Available balance: ₹{dashboardData?.withdrawable_balance?.toFixed(2) || '0.00'}
                </p>
                <Button
                  onClick={() => setShowWithdrawModal(true)}
                  disabled={!dashboardData?.withdrawable_balance || dashboardData.withdrawable_balance < 100}
                  className="w-full"
                >
                  <Icon name="Banknote" size={18} className="mr-2" />
                  Request Withdrawal
                </Button>
                {dashboardData?.withdrawable_balance < 100 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Minimum withdrawal amount is ₹100
                  </p>
                )}
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">How It Works</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Share Your Code</h3>
                    <p className="text-sm text-muted-foreground">
                      Share your unique referral code with friends and family
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">They Recharge</h3>
                    <p className="text-sm text-muted-foreground">
                      When they add money to their wallet, you earn commission
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Earn & Withdraw</h3>
                    <p className="text-sm text-muted-foreground">
                      Earn {dashboardData?.commission_rate || 10}% and withdraw anytime (min ₹100)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Commissions */}
            {dashboardData?.recent_commissions && dashboardData.recent_commissions.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Recent Commissions</h2>
                <div className="space-y-3">
                  {dashboardData.recent_commissions.map((commission, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                          <Icon name="TrendingUp" size={18} color="#22c55e" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Commission from {commission.referred_user_name || 'User'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(commission.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-green-500">+₹{commission.amount?.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Withdrawal Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-foreground">Request Withdrawal</h3>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <Input
                  label="Amount (₹)"
                  type="number"
                  placeholder="Enter amount (Min: ₹100)"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  min="100"
                />

                <Input
                  label="UPI ID"
                  type="text"
                  placeholder="yourname@paytm / yourname@okaxis"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  helperText="Enter your UPI ID for receiving payment"
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setShowWithdrawModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleWithdrawRequest}
                    disabled={processing}
                    className="flex-1"
                  >
                    {processing ? 'Processing...' : 'Submit Request'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Refer;

