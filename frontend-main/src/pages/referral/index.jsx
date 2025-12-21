import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { referralAPI } from '../../services/api';
import { useToast } from '../../hooks/useToast';

const ReferralPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
    fetchDashboard();
  }, []);

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

  const copyReferralLink = () => {
    if (dashboardData?.referral_code) {
      const referralLink = `${window.location.origin}/register?ref=${dashboardData.referral_code}`;
      navigator.clipboard.writeText(referralLink);
      toast?.success('Referral link copied to clipboard!');
    }
  };

  const copyCode = () => {
    if (dashboardData?.referral_code) {
      navigator.clipboard.writeText(dashboardData.referral_code);
      toast?.success('Referral code copied!');
    }
  };

  const handleWithdrawRequest = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast?.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(withdrawAmount) < (dashboardData?.min_withdrawal_amount || 100)) {
      toast?.error(`Minimum withdrawal amount is ₹${dashboardData?.min_withdrawal_amount || 100}`);
      return;
    }

    if (parseFloat(withdrawAmount) > dashboardData?.withdrawable_balance) {
      toast?.error('Insufficient balance');
      return;
    }

    let paymentDetails = {};
    if (paymentMethod === 'upi') {
      if (!upiId) {
        toast?.error('Please enter UPI ID');
        return;
      }
      paymentDetails = { upi_id: upiId };
    } else {
      if (!bankDetails.account_number || !bankDetails.ifsc_code || !bankDetails.account_holder_name) {
        toast?.error('Please fill all bank details');
        return;
      }
      paymentDetails = bankDetails;
    }

    try {
      setProcessing(true);
      await referralAPI.requestWithdrawal(
        parseFloat(withdrawAmount),
        paymentMethod,
        paymentDetails
      );
      toast?.success('Withdrawal request submitted successfully!');
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      setUpiId('');
      setBankDetails({ account_number: '', ifsc_code: '', account_holder_name: '' });
      fetchDashboard();
    } catch (error) {
      console.error('Error requesting withdrawal:', error);
      toast?.error(error.message || 'Failed to request withdrawal');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-8 pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading referral data...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-8 pb-20 px-4">
        <div className="max-w-7xl mx-auto">{/* Back Button */}
          <button 
            onClick={() => navigate('/dashboard')}
            className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="arrow-left" size="20" />
            <span>Back to Dashboard</span>
          </button>
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Referral Program</h1>
            <p className="text-muted-foreground">
              Earn {dashboardData?.commission_rate || 10}% commission on every wallet recharge by your referrals
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-2">
                <Icon name="Users" size={24} color="var(--color-primary)" />
                <span className="text-2xl font-bold text-foreground">{dashboardData?.total_referrals || 0}</span>
              </div>
              <p className="text-sm text-muted-foreground">Total Referrals</p>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-2">
                <Icon name="UserCheck" size={24} color="var(--color-success)" />
                <span className="text-2xl font-bold text-success">{dashboardData?.active_referrals || 0}</span>
              </div>
              <p className="text-sm text-muted-foreground">Active Referrals</p>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-2">
                <Icon name="TrendingUp" size={24} color="var(--color-warning)" />
                <span className="text-2xl font-bold text-warning">₹{dashboardData?.total_earnings?.toFixed(2) || '0.00'}</span>
              </div>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-2">
                <Icon name="Wallet" size={24} color="var(--color-primary)" />
                <span className="text-2xl font-bold text-primary">₹{dashboardData?.withdrawable_balance?.toFixed(2) || '0.00'}</span>
              </div>
              <p className="text-sm text-muted-foreground">Withdrawable</p>
              <Button
                variant="primary"
                size="sm"
                className="mt-3 w-full"
                onClick={() => setShowWithdrawModal(true)}
                disabled={!dashboardData?.withdrawable_balance || dashboardData?.withdrawable_balance < (dashboardData?.min_withdrawal_amount || 100)}
              >
                Withdraw
              </Button>
            </div>
          </div>

          {/* Referral Code Section */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20 p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">Your Referral Code</h3>
                <div className="flex items-center gap-3 mb-3">
                  <code className="px-4 py-2 bg-background rounded-lg border border-border text-xl font-bold text-primary">
                    {dashboardData?.referral_code || 'LOADING...'}
                  </code>
                  <Button variant="outline" size="sm" iconName="Copy" onClick={copyCode}>
                    Copy Code
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Share this code with your friends and earn {dashboardData?.commission_rate || 10}% commission on their wallet recharges!
                </p>
              </div>
              <Button variant="primary" iconName="Share2" onClick={copyReferralLink}>
                Share Referral Link
              </Button>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-card rounded-lg border border-border p-6 mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="UserPlus" size={24} color="var(--color-primary)" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">1. Share Your Code</h4>
                <p className="text-sm text-muted-foreground">
                  Share your unique referral code or link with friends
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="Wallet" size={24} color="var(--color-success)" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">2. They Add Money</h4>
                <p className="text-sm text-muted-foreground">
                  When they recharge their wallet, you earn commission
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="DollarSign" size={24} color="var(--color-warning)" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">3. Earn & Withdraw</h4>
                <p className="text-sm text-muted-foreground">
                  Earn {dashboardData?.commission_rate || 10}% and withdraw anytime (Min ₹{dashboardData?.min_withdrawal_amount || 100})
                </p>
              </div>
            </div>
          </div>

          {/* Referrals List */}
          {dashboardData?.referrals && dashboardData.referrals.length > 0 && (
            <div className="bg-card rounded-lg border border-border overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Your Referrals</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Joined</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Total Added</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Your Earnings</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {dashboardData.referrals.map((referral, index) => (
                      <tr key={index} className="hover:bg-muted/20">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-foreground">{referral.name}</p>
                            <p className="text-sm text-muted-foreground">{referral.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">
                          {new Date(referral.joined_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-foreground">
                          ₹{referral.total_amount_added?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-success">
                          ₹{referral.total_commission_earned?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {referral.is_active ? (
                            <span className="px-2 py-1 text-xs rounded-full bg-success/10 text-success">Active</span>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded-full bg-muted/50 text-muted-foreground">Inactive</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent Commissions */}
          {dashboardData?.recent_commissions && dashboardData.recent_commissions.length > 0 && (
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Recent Commissions</h3>
              </div>
              <div className="divide-y divide-border">
                {dashboardData.recent_commissions.map((commission, index) => (
                  <div key={index} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{commission.referred_user_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Added ₹{commission.topup_amount?.toFixed(2)} • {new Date(commission.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-success">+₹{commission.commission_amount?.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Commission</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <>
          <div className="fixed inset-0 bg-foreground/40 z-[250]" onClick={() => setShowWithdrawModal(false)} />
          <div className="fixed inset-0 z-[251] flex items-center justify-center p-4">
            <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Withdraw Earnings</h2>
              
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Available Balance</p>
                <p className="text-2xl font-bold text-primary">₹{dashboardData?.withdrawable_balance?.toFixed(2) || '0.00'}</p>
              </div>

              <Input
                label="Withdrawal Amount"
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                min={dashboardData?.min_withdrawal_amount || 100}
                max={dashboardData?.withdrawable_balance}
                required
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">Payment Method</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex-1 py-2 px-4 rounded-lg border ${paymentMethod === 'upi' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-foreground'}`}
                  >
                    UPI
                  </button>
                  <button
                    onClick={() => setPaymentMethod('bank')}
                    className={`flex-1 py-2 px-4 rounded-lg border ${paymentMethod === 'bank' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-foreground'}`}
                  >
                    Bank Transfer
                  </button>
                </div>
              </div>

              {paymentMethod === 'upi' ? (
                <Input
                  label="UPI ID"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  required
                />
              ) : (
                <>
                  <Input
                    label="Account Holder Name"
                    placeholder="Enter name"
                    value={bankDetails.account_holder_name}
                    onChange={(e) => setBankDetails({...bankDetails, account_holder_name: e.target.value})}
                    required
                    className="mb-3"
                  />
                  <Input
                    label="Account Number"
                    placeholder="Enter account number"
                    value={bankDetails.account_number}
                    onChange={(e) => setBankDetails({...bankDetails, account_number: e.target.value})}
                    required
                    className="mb-3"
                  />
                  <Input
                    label="IFSC Code"
                    placeholder="Enter IFSC code"
                    value={bankDetails.ifsc_code}
                    onChange={(e) => setBankDetails({...bankDetails, ifsc_code: e.target.value})}
                    required
                  />
                </>
              )}

              <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mb-4 mt-4">
                <p className="text-xs text-foreground">
                  • Minimum withdrawal: ₹{dashboardData?.min_withdrawal_amount || 100}<br/>
                  • Processing time: 1-3 business days<br/>
                  • One request at a time
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" fullWidth onClick={() => setShowWithdrawModal(false)} disabled={processing}>
                  Cancel
                </Button>
                <Button variant="primary" fullWidth onClick={handleWithdrawRequest} loading={processing}>
                  Request Withdrawal
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReferralPage;
