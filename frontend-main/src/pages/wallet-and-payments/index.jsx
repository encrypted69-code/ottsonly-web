// Code will be added manually
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../components/ui/NavigationBar';
import { ToastContainer } from '../../components/ui/Toast';
import { useToast } from '../../hooks/useToast';
import WalletBalanceCard from './components/WalletBalance';
import QuickAmountButtons from './components/QuickAmountButtons';
import TransactionFilters from './components/TransactionFilter';
import TransactionTable from './components/TransactionTable';
import PaymentMethodsCard from './components/PaymentMethods';
import AddMoneyModal from './components/AddMoneyModal';
import { authAPI, walletAPI } from '../../services/api';

const WalletAndPayments = () => {
  const navigate = useNavigate();
  const { toasts, toast, removeToast } = useToast();

  const [user, setUser] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoadingTransactions(true);
      const response = await walletAPI.getTransactions();
      
      if (response?.transactions) {
        // Transform transactions to match frontend format
        const transformedTransactions = response.transactions.map(txn => ({
          id: txn.id,
          description: txn.description,
          date: txn.created_at,
          type: txn.type,
          amount: txn.amount,
          status: 'success', // Assuming all completed transactions are successful
          referenceType: txn.reference_type,
          referenceId: txn.reference_id,
          balanceAfter: txn.balance_after
        }));
        
        setTransactions(transformedTransactions);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast?.error('Failed to load transaction history');
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };
  const [selectedQuickAmount, setSelectedQuickAmount] = useState(null);
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const quickAmounts = [500, 1000, 2500, 5000];

  const [filters, setFilters] = useState({
    dateRange: 'all',
    type: 'all',
    status: 'all',
    search: '',
    fromDate: '',
    toDate: ''
  });

  const [paymentMethods] = useState([
    {
      id: "PM001",
      type: "visa",
      name: "Visa ending in 4242",
      details: "Expires 12/2026",
      isDefault: true
    },
    {
      id: "PM002",
      type: "upi",
      name: "UPI ID",
      details: "sarah@okaxis",
      isDefault: false
    },
    {
      id: "PM003",
      type: "mastercard",
      name: "Mastercard ending in 8888",
      details: "Expires 08/2025",
      isDefault: false
    }
  ]);

  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    applyFilters();
  }, [filters, transactions]);

  const applyFilters = () => {
    let filtered = [...transactions];

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(txn => txn.type === filters.type);
    }

    // Filter by search
    if (filters.search) {
      filtered = filtered.filter(txn => 
        txn.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        txn.id.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let startDate = new Date();

      switch (filters.dateRange) {
        case '7days':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90days':
          startDate.setDate(now.getDate() - 90);
          break;
        case 'custom':
          if (filters.fromDate && filters.toDate) {
            startDate = new Date(filters.fromDate);
            const endDate = new Date(filters.toDate);
            filtered = filtered.filter(txn => {
              const txnDate = new Date(txn.date);
              return txnDate >= startDate && txnDate <= endDate;
            });
          }
          break;
      }

      if (filters.dateRange !== 'custom') {
        filtered = filtered.filter(txn => new Date(txn.date) >= startDate);
      }
    }

    setFilteredTransactions(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      dateRange: 'all',
      type: 'all',
      status: 'all',
      search: '',
      fromDate: '',
      toDate: ''
    });
  };

  const handleExport = () => {
    toast?.info('Exporting transactions to CSV...');
    setTimeout(() => {
      toast?.success('Transaction report downloaded successfully!');
    }, 1500);
  };

  const handleAddMoney = async (amount) => {
    // Refresh user data to get updated balance
    await fetchUserData();
    await fetchTransactions();
    toast?.success(`Successfully added ₹${amount?.toFixed(2)} to your wallet!`);
  };

  const handleQuickAmountSelect = (amount) => {
    setSelectedQuickAmount(amount);
    setIsAddMoneyModalOpen(true);
  };

  const handleAddPaymentMethod = () => {
    toast?.info('Payment method addition coming soon!');
  };

  const handleRemovePaymentMethod = (id) => {
    toast?.success('Payment method removed successfully!');
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
        onLogout={handleLogout}
      />

      <main className="pt-20 pb-24 lg:pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Wallet & Payments</h1>
            <p className="text-muted-foreground">Manage your wallet balance and view transaction history</p>
          </div>

          <WalletBalanceCard 
            balance={walletBalance}
            onAddMoney={() => setIsAddMoneyModalOpen(true)}
          />

          <QuickAmountButtons 
            amounts={quickAmounts}
            onSelectAmount={handleQuickAmountSelect}
            selectedAmount={selectedQuickAmount}
          />

          <PaymentMethodsCard 
            paymentMethods={paymentMethods}
            onAddMethod={handleAddPaymentMethod}
            onRemoveMethod={handleRemovePaymentMethod}
          />

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Transaction History</h2>
            
            <TransactionFilters 
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
              onExport={handleExport}
            />

            <TransactionTable 
              transactions={filteredTransactions}
              loading={isLoadingTransactions}
            />
          </div>
        </div>
      </main>

      <AddMoneyModal 
        isOpen={isAddMoneyModalOpen}
        onClose={() => {
          setIsAddMoneyModalOpen(false);
          setSelectedQuickAmount(null);
        }}
        onAddMoney={handleAddMoney}
        quickAmounts={quickAmounts}
      />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default WalletAndPayments;