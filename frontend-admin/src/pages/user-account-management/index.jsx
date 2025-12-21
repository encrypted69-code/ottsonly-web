import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Breadcrumb from '../../components/Breadcrumb';
import UserSearchBar from './components/UserSearchBar';
import UserDetailsCard from './components/UserDetailsCard';
import FundManagementPanel from './components/FundManagementPanel';
import AccountActionsPanel from './components/AccountActionsPanel';
import TransactionHistory from './components/TransactionHistory';
import { userAPI } from '../../services/api';

const UserAccountManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userAPI.getAll();
      setAllUsers(response.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSearch = async (searchTerm) => {
    setSearchQuery(searchTerm);
    
    if (!searchTerm) {
      setSelectedUser(null);
      return;
    }

    try {
      // Search in locally loaded users first
      const localMatch = allUsers.find(u => 
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone?.includes(searchTerm) ||
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (localMatch) {
        // Fetch full user details
        const fullUser = await userAPI.getById(localMatch.id);
        setSelectedUser(fullUser);
      } else {
        // Search on server
        const response = await userAPI.getAll({ search: searchTerm });
        if (response.users && response.users.length > 0) {
          const fullUser = await userAPI.getById(response.users[0].id);
          setSelectedUser(fullUser);
        } else {
          setSelectedUser(null);
        }
      }
    } catch (err) {
      console.error('Search error:', err);
      setSelectedUser(null);
    }
  };

  const handleFundAdd = async (amount, reason) => {
    if (!selectedUser) return;

    try {
      await userAPI.creditWallet(selectedUser.id, parseFloat(amount), reason);
      // Refresh user details
      const updatedUser = await userAPI.getById(selectedUser.id);
      setSelectedUser(updatedUser);
    } catch (err) {
      console.error('Error adding funds:', err);
      alert(err.message || 'Failed to add funds');
    }
  };

  const handleFundDeduct = async (amount, reason) => {
    if (!selectedUser) return;

    try {
      await userAPI.debitWallet(selectedUser.id, parseFloat(amount), reason);
      // Refresh user details
      const updatedUser = await userAPI.getById(selectedUser.id);
      setSelectedUser(updatedUser);
    } catch (err) {
      console.error('Error deducting funds:', err);
      alert(err.message || 'Failed to deduct funds');
    }
  };

  const handleBlockAccount = async () => {
    if (!selectedUser) return;

    try {
      await userAPI.blockUser(selectedUser.id);
      // Refresh user details
      const updatedUser = await userAPI.getById(selectedUser.id);
      setSelectedUser(updatedUser);
    } catch (err) {
      console.error('Error blocking account:', err);
      alert(err.message || 'Failed to block account');
    }
  };

  const handleUnblockAccount = async () => {
    if (!selectedUser) return;

    try {
      await userAPI.unblockUser(selectedUser.id);
      // Refresh user details
      const updatedUser = await userAPI.getById(selectedUser.id);
      setSelectedUser(updatedUser);
    } catch (err) {
      console.error('Error unblocking account:', err);
      alert(err.message || 'Failed to unblock account');
    }
  };

  const handleForceLogout = async () => {
    if (!selectedUser) return;

    try {
      await userAPI.forceLogout(selectedUser.id);
      alert('User has been logged out from all devices');
    } catch (err) {
      console.error('Error forcing logout:', err);
      alert(err.message || 'Failed to logout user');
    }
  };

  const mockTransactions = [
    {
      id: 'txn_001',
      type: 'credit',
      amount: 500,
      description: 'Wallet recharge',
      date: '2025-12-15 10:30 AM',
      status: 'completed'
    },
    {
      id: 'txn_002',
      type: 'debit',
      amount: 299,
      description: 'Netflix subscription',
      date: '2025-12-14 03:45 PM',
      status: 'completed'
    },
    {
      id: 'txn_003',
      type: 'credit',
      amount: 1000,
      description: 'Refund processed',
      date: '2025-12-13 11:20 AM',
      status: 'completed'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading user management...</p>
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
            <h1 className="text-3xl font-bold text-foreground mb-2">User Account Management</h1>
            <p className="text-muted-foreground">
              Manage user accounts, funds, and access control for OTTSONLY platform
            </p>
          </div>

          <UserSearchBar onSearch={handleUserSearch} searchQuery={searchQuery} />

          {selectedUser ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-6">
                <UserDetailsCard user={selectedUser} />
                <TransactionHistory transactions={mockTransactions} />
              </div>
              <div className="lg:col-span-4 space-y-6">
                <FundManagementPanel 
                  user={selectedUser}
                  onAddFunds={handleFundAdd}
                  onDeductFunds={handleFundDeduct}
                />
                <AccountActionsPanel 
                  user={selectedUser}
                  onBlock={handleBlockAccount}
                  onUnblock={handleUnblockAccount}
                />
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-lg p-12 shadow-card border border-border text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Search for a User</h3>
              <p className="text-muted-foreground">
                Enter a username in the search bar above to manage user accounts and funds
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserAccountManagement;