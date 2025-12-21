import { User, Wallet, Calendar, Activity, CreditCard, TrendingUp } from 'lucide-react';

export default function UserDetailsPanel({ user }) {
  const transactions = [
    { id: 1, type: 'credit', amount: 1000, reason: 'Wallet top-up', date: '2024-12-15', status: 'completed' },
    { id: 2, type: 'debit', amount: 500, reason: 'Subscription payment', date: '2024-12-14', status: 'completed' },
    { id: 3, type: 'credit', amount: 2000, reason: 'Refund', date: '2024-12-13', status: 'completed' },
    { id: 4, type: 'debit', amount: 300, reason: 'Platform fee', date: '2024-12-12', status: 'completed' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.username}</h2>
            <p className="text-indigo-100">{user?.email}</p>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {/* Account Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Wallet className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Balance</p>
              <p className="text-xl font-bold text-gray-900">₹{user?.balance?.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Subscription</p>
              <p className="text-xl font-bold text-gray-900">{user?.subscriptionStatus}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Account Health</p>
              <p className="text-xl font-bold text-gray-900">{user?.accountHealth}</p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-600">Join Date</p>
              <p className="text-sm font-medium text-gray-900">{user?.joinDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-600">Last Activity</p>
              <p className="text-sm font-medium text-gray-900">{user?.lastActivity}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-600">Total Transactions</p>
              <p className="text-sm font-medium text-gray-900">{user?.totalTransactions}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-600">Account Status</p>
              <p className={`text-sm font-medium ${user?.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                {user?.status?.charAt(0)?.toUpperCase() + user?.status?.slice(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {transactions?.map((transaction) => (
              <div key={transaction?.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction?.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <TrendingUp className={`w-5 h-5 ${
                      transaction?.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction?.reason}</p>
                    <p className="text-sm text-gray-600">{transaction?.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction?.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction?.type === 'credit' ? '+' : '-'}₹{transaction?.amount?.toLocaleString()}
                  </p>
                  <span className="text-xs text-gray-500">{transaction?.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}