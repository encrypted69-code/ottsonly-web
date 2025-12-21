import React, { useState, useEffect } from 'react';
import { referralAPI } from '../../services/api';
import AppIcon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import { useToast } from '../../hooks/useToast';

const ReferralManagement = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_users: 0,
    total_commissions_paid: 0,
    pending_withdrawals: 0,
    total_withdrawn: 0
  });
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [allWithdrawals, setAllWithdrawals] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [selectedTab, setSelectedTab] = useState('pending');
  const [processing, setProcessing] = useState({});
  const [adminNotes, setAdminNotes] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    setLoading(true);
    try {
      const [statsData, pendingData, allData, commissionsData] = await Promise.all([
        referralAPI.getStats(),
        referralAPI.getPendingWithdrawals(),
        referralAPI.getAllWithdrawals(),
        referralAPI.getCommissions()
      ]);
      
      setStats(statsData);
      setPendingWithdrawals(pendingData);
      setAllWithdrawals(allData);
      setCommissions(commissionsData);
    } catch (error) {
      console.error('Error fetching referral data:', error);
      toast.error('Failed to load referral data');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessWithdrawal = async (withdrawalId, status) => {
    setProcessing(prev => ({ ...prev, [withdrawalId]: true }));
    try {
      await referralAPI.processWithdrawal(withdrawalId, {
        status,
        admin_notes: adminNotes[withdrawalId] || ''
      });
      toast.success(`Withdrawal ${status} successfully`);
      fetchReferralData();
      setAdminNotes(prev => {
        const newNotes = { ...prev };
        delete newNotes[withdrawalId];
        return newNotes;
      });
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      toast.error(`Failed to ${status} withdrawal`);
    } finally {
      setProcessing(prev => ({ ...prev, [withdrawalId]: false }));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600',
      approved: 'text-green-600',
      rejected: 'text-red-600'
    };
    return colors[status] || 'text-muted-foreground';
  };

  const getStatusBg = (status) => {
    const colors = {
      pending: 'bg-yellow-100',
      approved: 'bg-green-100',
      rejected: 'bg-red-100'
    };
    return colors[status] || 'bg-muted';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-8">
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin">
                <AppIcon name="Loader2" size={40} color="var(--color-primary)" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-8">
          <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Referral Management' }]} />
          
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin">
                <AppIcon name="Loader2" size={40} color="var(--color-primary)" />
              </div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="group bg-gradient-to-br from-card to-card/50 rounded-lg p-4 border border-border shadow hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <AppIcon name="Users" size={20} color="#3b82f6" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground mb-1">{stats.total_users}</p>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Total Users</p>
                </div>

                <div className="group bg-gradient-to-br from-card to-card/50 rounded-lg p-4 border border-border shadow hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <AppIcon name="TrendingUp" size={20} color="#22c55e" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground mb-1">₹{stats.total_commissions_paid?.toFixed(2)}</p>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Commissions Paid</p>
                </div>

                <div className="group bg-gradient-to-br from-card to-card/50 rounded-lg p-4 border border-border shadow hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                      <AppIcon name="Clock" size={20} color="#eab308" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground mb-1">{stats.pending_withdrawals}</p>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Pending Withdrawals</p>
                </div>

                <div className="group bg-gradient-to-br from-card to-card/50 rounded-lg p-4 border border-border shadow hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <AppIcon name="Wallet" size={20} color="#a855f7" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground mb-1">₹{stats.total_withdrawn?.toFixed(2)}</p>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Total Withdrawn</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-card rounded-lg border border-border shadow">
                <div className="flex gap-1 p-1 border-b border-border bg-muted/30">
                  <button
                    onClick={() => setSelectedTab('pending')}
                    className={`flex-1 px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 ${
                      selectedTab === 'pending'
                        ? 'bg-primary text-primary-foreground shadow'
                        : 'text-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <AppIcon name="Clock" size={16} />
                      <span>Pending ({pendingWithdrawals.length})</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedTab('all')}
                    className={`flex-1 px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 ${
                      selectedTab === 'all'
                        ? 'bg-primary text-primary-foreground shadow'
                        : 'text-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <AppIcon name="List" size={16} />
                      <span>All Withdrawals</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedTab('commissions')}
                    className={`flex-1 px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 ${
                      selectedTab === 'commissions'
                        ? 'bg-primary text-primary-foreground shadow'
                        : 'text-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <AppIcon name="TrendingUp" size={16} />
                      <span>Commissions</span>
                    </div>
                  </button>
                </div>

                <div className="p-4">
                  {/* Pending Withdrawals Tab */}
                  {selectedTab === 'pending' && (
                    <div className="space-y-4">
                      {pendingWithdrawals.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="flex flex-col items-center justify-center">
                            <AppIcon name="CheckCircle" size={48} color="var(--color-muted-foreground)" className="mb-4" />
                            <p className="text-lg font-bold text-foreground mb-1">All caught up!</p>
                            <p className="text-sm text-muted-foreground">No pending withdrawal requests</p>
                          </div>
                        </div>
                      ) : (
                        pendingWithdrawals.map((withdrawal) => (
                          <div key={withdrawal._id} className="bg-gradient-to-br from-muted/20 to-muted/5 rounded-lg border border-border p-4 hover:shadow transition-all duration-200">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <AppIcon name="User" size={20} color="var(--color-primary)" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-foreground">{withdrawal.user_name}</h3>
                                  <p className="text-xs text-muted-foreground">{withdrawal.user_email}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-primary">₹{withdrawal.amount?.toFixed(2)}</p>
                                <p className="text-xs font-semibold text-muted-foreground uppercase">Withdrawal Request</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4 bg-card/50 rounded p-3 border border-border">
                              <div>
                                <p className="text-sm font-bold text-muted-foreground uppercase mb-2">UPI ID</p>
                                <p className="text-lg font-semibold text-primary">{withdrawal.upi_id || withdrawal.payment_details?.upi_id}</p>
                              </div>
                              <div>
                                <p className="text-sm font-bold text-muted-foreground uppercase mb-2">Request Date</p>
                                <p className="text-lg font-semibold text-foreground">
                                  {new Date(withdrawal.created_at).toLocaleDateString('en-IN', { 
                                    day: 'numeric', 
                                    month: 'short', 
                                    year: 'numeric' 
                                  })}
                                </p>
                              </div>
                            </div>

                            <div className="mb-6">
                              <label className="block text-sm font-bold text-foreground mb-3 uppercase">Admin Notes (Optional)</label>
                              <Input
                                type="text"
                                placeholder="Add notes for records..."
                                value={adminNotes[withdrawal._id] || ''}
                                onChange={(e) => setAdminNotes(prev => ({ ...prev, [withdrawal._id]: e.target.value }))}
                                className="w-full text-base"
                              />
                            </div>

                            <div className="flex gap-4">
                              <Button
                                onClick={() => handleProcessWithdrawal(withdrawal._id, 'approved')}
                                disabled={processing[withdrawal._id]}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 text-lg"
                              >
                                {processing[withdrawal._id] ? (
                                  <div className="flex items-center justify-center gap-2">
                                    <div className="animate-spin">
                                      <AppIcon name="Loader2" size={20} className="mr-2" />
                                    </div>
                                    Processing...
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center gap-2">
                                    <AppIcon name="CheckCircle" size={20} className="mr-2" />
                                    Done - Payment Sent
                                  </div>
                                )}
                              </Button>
                              <Button
                                onClick={() => handleProcessWithdrawal(withdrawal._id, 'rejected')}
                                disabled={processing[withdrawal._id]}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-4 text-lg"
                              >
                                <AppIcon name="X" size={20} className="mr-2" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* All Withdrawals Tab */}
                  {selectedTab === 'all' && (
                    <div className="overflow-hidden rounded-lg border border-border">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/30">
                          <tr>
                            <th className="text-left py-3 px-4 text-xs font-bold text-foreground uppercase">User</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-foreground uppercase">Amount</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-foreground uppercase">Method</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-foreground uppercase">Status</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-foreground uppercase">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {allWithdrawals.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="py-12 text-center">
                                <div className="flex flex-col items-center justify-center">
                                  <AppIcon name="FileX" size={36} color="var(--color-muted-foreground)" className="mb-2" />
                                  <p className="text-sm font-medium text-muted-foreground">No withdrawal records found</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            allWithdrawals.map((withdrawal) => (
                              <tr key={withdrawal._id}>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                      <AppIcon name="User" size={14} color="var(--color-primary)" />
                                    </div>
                                    <span className="font-semibold text-foreground text-sm">{withdrawal.user_name}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-base font-bold text-foreground">₹{withdrawal.amount?.toFixed(2)}</td>
                                <td className="py-3 px-4">
                                  <span className="text-xs font-bold text-foreground uppercase bg-muted/50 px-2 py-1 rounded">
                                    {withdrawal.payment_method}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold uppercase ${getStatusBg(withdrawal.status)} ${getStatusColor(withdrawal.status)}`}>
                                    {withdrawal.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-xs font-medium text-muted-foreground">
                                  {new Date(withdrawal.created_at).toLocaleDateString('en-IN', { 
                                    day: 'numeric', 
                                    month: 'short', 
                                    year: 'numeric' 
                                  })}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Commissions Tab */}
                  {selectedTab === 'commissions' && (
                    <div className="overflow-hidden rounded-lg border border-border">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/30">
                          <tr>
                            <th className="text-left py-3 px-4 text-xs font-bold text-foreground uppercase">Referrer</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-foreground uppercase">Referred User</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-foreground uppercase">Commission</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-foreground uppercase">Transaction</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-foreground uppercase">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {commissions.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="py-12 text-center">
                                <div className="flex flex-col items-center justify-center">
                                  <AppIcon name="FileX" size={36} color="var(--color-muted-foreground)" className="mb-2" />
                                  <p className="text-sm font-medium text-muted-foreground">No commission records found</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            commissions.map((commission) => (
                              <tr key={commission._id}>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                      <AppIcon name="User" size={14} color="#3b82f6" />
                                    </div>
                                    <span className="font-semibold text-foreground text-sm">{commission.referrer_name}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-1">
                                    <AppIcon name="ArrowRight" size={14} color="var(--color-muted-foreground)" />
                                    <span className="font-medium text-foreground text-sm">{commission.referred_user_name}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-1">
                                    <AppIcon name="TrendingUp" size={14} color="#22c55e" />
                                    <span className="text-base font-bold text-green-500">₹{commission.amount?.toFixed(2)}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-foreground font-semibold text-sm">₹{commission.transaction_amount?.toFixed(2)}</td>
                                <td className="py-3 px-4 text-xs font-medium text-muted-foreground">
                                  {new Date(commission.created_at).toLocaleDateString('en-IN', { 
                                    day: 'numeric', 
                                    month: 'short', 
                                    year: 'numeric' 
                                  })}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ReferralManagement;
