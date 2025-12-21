import { X, AlertCircle, Lock, Unlock, Plus, Minus } from 'lucide-react';
import Icon from '../../../components/AppIcon';


export default function TransactionModal({ type, user, onClose, onSubmit }) {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (type !== 'block' && !amount) {
      alert('Please enter an amount');
      return;
    }
    
    if (!reason) {
      alert('Please provide a reason');
      return;
    }

    if (type === 'deduct' && !twoFACode) {
      setRequires2FA(true);
      return;
    }

    onSubmit({
      amount: type !== 'block' ? parseFloat(amount) : null,
      reason,
      twoFACode: type === 'deduct' ? twoFACode : null,
    });
  };

  const modalConfig = {
    add: {
      title: 'Add Funds',
      icon: Plus,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      buttonColor: 'bg-green-600 hover:bg-green-700',
    },
    deduct: {
      title: 'Deduct Funds',
      icon: Minus,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      buttonColor: 'bg-orange-600 hover:bg-orange-700',
    },
    block: {
      title: user?.status === 'blocked' ? 'Unblock Account' : 'Block Account',
      icon: user?.status === 'blocked' ? Unlock : Lock,
      iconBg: user?.status === 'blocked' ? 'bg-blue-100' : 'bg-red-100',
      iconColor: user?.status === 'blocked' ? 'text-blue-600' : 'text-red-600',
      buttonColor: user?.status === 'blocked' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700',
    },
  };

  const config = modalConfig?.[type];
  const Icon = config?.icon;

  const reasonOptions = {
    add: ['Wallet Top-up', 'Refund', 'Promotional Credit', 'Compensation', 'Other'],
    deduct: ['Subscription Payment', 'Platform Fee', 'Penalty', 'Chargeback', 'Other'],
    block: ['Suspicious Activity', 'Policy Violation', 'Payment Issues', 'User Request', 'Other'],
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${config?.iconBg} rounded-lg`}>
              <Icon className={`w-6 h-6 ${config?.iconColor}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{config?.title}</h2>
              <p className="text-sm text-gray-600">User: {user?.username}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Amount Input (not for block action) */}
          {type !== 'block' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e?.target?.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                min="1"
                step="0.01"
              />
              <p className="text-xs text-gray-500 mt-1">
                Current balance: ₹{user?.balance?.toLocaleString()}
              </p>
            </div>
          )}

          {/* Reason Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e?.target?.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select reason</option>
              {reasonOptions?.[type]?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* 2FA Code (for deduct action) */}
          {type === 'deduct' && requires2FA && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-900">Two-Factor Authentication Required</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Deducting funds requires additional verification
                  </p>
                </div>
              </div>
              <input
                type="text"
                value={twoFACode}
                onChange={(e) => setTwoFACode(e?.target?.value)}
                placeholder="Enter 2FA code"
                className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                maxLength="6"
              />
            </div>
          )}

          {/* Warning for block action */}
          {type === 'block' && (
            <div className={`${user?.status === 'blocked' ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'} border rounded-lg p-4`}>
              <div className="flex items-start gap-2">
                <AlertCircle className={`w-5 h-5 ${user?.status === 'blocked' ? 'text-blue-600' : 'text-red-600'} mt-0.5`} />
                <div>
                  <h4 className={`font-medium ${user?.status === 'blocked' ? 'text-blue-900' : 'text-red-900'}`}>
                    {user?.status === 'blocked' ? 'Restore Account Access' : 'Warning'}
                  </h4>
                  <p className={`text-sm ${user?.status === 'blocked' ? 'text-blue-700' : 'text-red-700'} mt-1`}>
                    {user?.status === 'blocked' ?'This will restore full account access for the user.' :'This action will immediately suspend the user account and prevent all access.'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${config?.buttonColor}`}
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}