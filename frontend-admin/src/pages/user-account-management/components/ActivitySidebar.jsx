import { Clock, AlertTriangle, TrendingUp, Users } from 'lucide-react';

export default function ActivitySidebar() {
  const recentActivities = [
    { id: 1, type: 'fund_added', user: 'john_doe', amount: 1000, time: '2 mins ago' },
    { id: 2, type: 'account_blocked', user: 'mike_wilson', time: '15 mins ago' },
    { id: 3, type: 'fund_deducted', user: 'jane_smith', amount: 500, time: '1 hour ago' },
    { id: 4, type: 'account_unblocked', user: 'sarah_jones', time: '2 hours ago' },
  ];

  const alerts = [
    { id: 1, message: 'Low balance alert for user: alex_brown', severity: 'warning' },
    { id: 2, message: 'Multiple failed login attempts: user_123', severity: 'high' },
    { id: 3, message: 'Unusual transaction pattern detected', severity: 'medium' },
  ];

  return (
    <div className="space-y-6">
      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-900">Recent Activities</h3>
        </div>
        <div className="space-y-3">
          {recentActivities?.map((activity) => (
            <div key={activity?.id} className="pb-3 border-b border-gray-100 last:border-0">
              <div className="flex items-start gap-2">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity?.type === 'fund_added' ? 'bg-green-500' :
                  activity?.type === 'fund_deducted' ? 'bg-orange-500' :
                  activity?.type === 'account_blocked'? 'bg-red-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    {activity?.type === 'fund_added' && `₹${activity?.amount} added to `}
                    {activity?.type === 'fund_deducted' && `₹${activity?.amount} deducted from `}
                    {activity?.type === 'account_blocked' && 'Account blocked: '}
                    {activity?.type === 'account_unblocked' && 'Account unblocked: '}
                    <span className="font-medium">{activity?.user}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity?.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Alerts */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <h3 className="font-semibold text-gray-900">Alerts</h3>
        </div>
        <div className="space-y-3">
          {alerts?.map((alert) => (
            <div
              key={alert?.id}
              className={`p-3 rounded-lg border-l-4 ${
                alert?.severity === 'high' ? 'bg-red-50 border-red-500' :
                alert?.severity === 'medium'? 'bg-orange-50 border-orange-500' : 'bg-yellow-50 border-yellow-500'
              }`}
            >
              <p className="text-sm text-gray-900">{alert?.message}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Quick Stats */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5" />
          <h3 className="font-semibold">Today's Stats</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-indigo-100">Funds Added</span>
            <span className="font-bold">₹12,500</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-indigo-100">Funds Deducted</span>
            <span className="font-bold">₹3,200</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-indigo-100">Accounts Blocked</span>
            <span className="font-bold">2</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-indigo-100">New Users</span>
            <span className="font-bold">5</span>
          </div>
        </div>
      </div>
    </div>
  );
}