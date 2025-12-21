import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Breadcrumb from '../../components/Breadcrumb';
import UserTable from './components/UserTable';
import UserDetailModal from './components/UserDetailModal';
import BlockUserModal from './components/BlockUserModal';
import { userAPI } from '../../services/api';

const UserBehaviorAnalytics = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [userToBlock, setUserToBlock] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if admin is logged in
      const token = localStorage.getItem('admin_token');
      if (!token) {
        window.location.href = '/admin-login';
        return;
      }
      
      const response = await userAPI.getAll();
      
      // Transform backend data to match frontend format
      const transformedUsers = response.users.map(user => ({
        userId: user.id || user._id,
        fullName: user.name || 'N/A',
        email: user.email || 'N/A',
        phone: user.phone || 'N/A',
        referralCode: user.referral_code || 'N/A',
        referredBy: user.referred_by || 'None',
        totalReferrals: user.total_referrals || 0,
        walletBalance: user.wallet_balance || 0,
        status: user.is_active ? 'active' : 'blocked',
        registrationDate: new Date(user.created_at).toLocaleDateString() || 'N/A',
        lastLogin: user.last_login ? new Date(user.last_login).toLocaleString() : 'Never',
        purchases: user.purchases || [],
        transactions: user.transactions || [],
        referrals: user.referrals || []
      }));
      
      setUsers(transformedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  // Keep mock user data as fallback
  const [mockUsers] = useState([
    {
      userId: "USR001",
      fullName: "John Doe",
      email: "john.doe@gmail.com",
      phone: "+91 9876543210",
      referralCode: "JOHN2024",
      referredBy: "USR045",
      totalReferrals: 12,
      walletBalance: 1250,
      status: "active",
      registrationDate: "2024-01-15",
      lastLogin: "2 hours ago",
      purchases: [
        {
          orderId: "ORD001",
          platform: "Netflix",
          planName: "Premium Plan - 4K",
          price: 89,
          date: "2024-12-01",
          status: "active"
        }
      ],
      transactions: [
        {
          transactionId: "TXN001",
          type: "Wallet Credit",
          amount: 500,
          method: "Razorpay",
          status: "success",
          date: "2024-12-15"
        }
      ],
      referrals: [
        {
          name: "Jane Smith",
          email: "jane@gmail.com",
          earning: 50,
          date: "2024-11-20"
        }
      ]
    },
    {
      userId: "USR002",
      fullName: "Sarah Johnson",
      email: "sarah.j@gmail.com",
      phone: "+91 9876543211",
      referralCode: "SARAH2024",
      referredBy: null,
      totalReferrals: 25,
      walletBalance: 2450,
      status: "active",
      registrationDate: "2024-02-20",
      lastLogin: "1 day ago",
      purchases: [],
      transactions: [],
      referrals: []
    },
    {
      userId: "USR003",
      fullName: "Mike Wilson",
      email: "mike.w@gmail.com",
      phone: "+91 9876543212",
      referralCode: "MIKE2024",
      referredBy: "USR001",
      totalReferrals: 8,
      walletBalance: 850,
      status: "blocked",
      registrationDate: "2024-03-10",
      lastLogin: "3 days ago",
      purchases: [],
      transactions: [],
      referrals: []
    },
    {
      userId: "USR004",
      fullName: "Emily Brown",
      email: "emily.b@gmail.com",
      phone: "+91 9876543213",
      referralCode: "EMILY2024",
      referredBy: "USR002",
      totalReferrals: 15,
      walletBalance: 1650,
      status: "active",
      registrationDate: "2024-04-05",
      lastLogin: "5 hours ago",
      purchases: [],
      transactions: [],
      referrals: []
    },
    {
      userId: "USR005",
      fullName: "David Lee",
      email: "david.l@gmail.com",
      phone: "+91 9876543214",
      referralCode: "DAVID2024",
      referredBy: null,
      totalReferrals: 30,
      walletBalance: 3200,
      status: "suspended",
      registrationDate: "2024-01-25",
      lastLogin: "1 hour ago",
      purchases: [],
      transactions: [],
      referrals: []
    }
  ]);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleBlockUser = (user) => {
    setUserToBlock(user);
    setIsBlockModalOpen(true);
  };

  const handleConfirmBlock = async (userId, reason) => {
    try {
      const user = users.find(u => u.userId === userId);
      if (user.status === 'blocked') {
        await userAPI.unblockUser(userId);
      } else {
        await userAPI.blockUser(userId);
      }
      
      // Refresh the user list to show updated status
      await fetchUsers();
      
      console.log(`User ${userId} ${user.status === "blocked" ? "unblocked" : "blocked"}. Reason: ${reason}`);
    } catch (err) {
      console.error('Error blocking/unblocking user:', err);
      alert(err.message || 'Failed to update user status');
    }
  };

  const handleWalletAction = async ({ userId, type, amount, reason, note }) => {
    try {
      if (type === 'credit') {
        await userAPI.creditWallet(userId, amount, reason || note);
        alert(`Successfully added ₹${amount} to user's wallet`);
      } else {
        await userAPI.debitWallet(userId, amount, reason || note);
        alert(`Successfully deducted ₹${amount} from user's wallet`);
      }
      
      // Refresh the user list to show updated wallet balance
      await fetchUsers();
      
      console.log(`Wallet ${type}: ₹${amount} for user ${userId}. Reason: ${reason}, Note: ${note}`);
    } catch (err) {
      console.error('Error updating wallet:', err);
      const errorMessage = typeof err === 'string' ? err : 
                          err?.message || 
                          err?.detail || 
                          'Failed to update wallet';
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="lg:ml-60 pt-24">
        <div className="p-6 lg:p-8">
          <Breadcrumb />
          
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
              <p className="text-muted-foreground">
                Comprehensive user management system for OTTSONLY platform
              </p>
            </div>
            <button
              onClick={fetchUsers}
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
            >
              <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500 text-red-500 rounded-lg">
              {error}
            </div>
          )}

          {isLoading && users.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading users...</p>
            </div>
          ) : (
            <UserTable 
              users={users}
              onViewUser={handleViewUser}
              onBlockUser={handleBlockUser}
            />
          )}
        </div>
      </main>

      <UserDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        user={selectedUser}
        onWalletAction={handleWalletAction}
      />

      <BlockUserModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        user={userToBlock}
        onConfirm={handleConfirmBlock}
      />
    </div>
  );
};

export default UserBehaviorAnalytics;