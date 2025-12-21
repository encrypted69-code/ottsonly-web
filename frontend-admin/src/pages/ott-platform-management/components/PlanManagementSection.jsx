import { TrendingUp, Users, Package } from 'lucide-react';

export default function PlanManagementSection({ platforms }) {
  const [activeTab, setActiveTab] = useState('all');

  const allPlans = platforms?.flatMap(platform =>
    platform?.plans?.map(plan => ({
      ...plan,
      platformName: platform?.name,
      platformId: platform?.id,
    }))
  );

  const tabs = [
    { id: 'all', label: 'All Plans' },
    { id: 'basic', label: 'Basic' },
    { id: 'premium', label: 'Premium' },
    { id: 'family', label: 'Family' },
  ];

  const filteredPlans = activeTab === 'all'
    ? allPlans
    : allPlans?.filter(plan => plan?.type?.toLowerCase()?.includes(activeTab));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Plan Management</h2>
        <p className="text-gray-600">View and manage all subscription plans across platforms</p>
      </div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs?.map(tab => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab?.id
                ? 'text-indigo-600 border-b-2 border-indigo-600' :'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab?.label}
          </button>
        ))}
      </div>
      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlans?.map((plan, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{plan?.type}</h3>
                <p className="text-sm text-gray-600">{plan?.platformName}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-indigo-600">₹{plan?.price}</p>
                <p className="text-xs text-gray-500">per month</p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2 mb-4">
              {plan?.features?.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                  <p className="text-sm text-gray-700">{feature}</p>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="flex items-center gap-1 mb-1">
                  <Users className="w-3 h-3 text-gray-600" />
                  <span className="text-xs text-gray-600">Popularity</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">High</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="w-3 h-3 text-gray-600" />
                  <span className="text-xs text-gray-600">Growth</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">+12%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredPlans?.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No plans found for this category</p>
        </div>
      )}
    </div>
  );
}