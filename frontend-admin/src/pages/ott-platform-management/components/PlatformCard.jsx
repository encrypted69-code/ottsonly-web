import { Edit2, Trash2, Key, Users, TrendingUp, CheckCircle } from 'lucide-react';

export default function PlatformCard({ platform, onEdit, onRemove, onManageCredentials }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Platform Header */}
      <div className="relative h-32 bg-gradient-to-br from-indigo-500 to-purple-600">
        <img
          src={platform?.logo}
          alt={`${platform?.name} logo`}
          className="absolute inset-0 w-full h-full object-contain p-8"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            platform?.status === 'active' ?'bg-green-100 text-green-700' :'bg-gray-100 text-gray-700'
          }`}>
            {platform?.status}
          </span>
        </div>
      </div>
      {/* Platform Info */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{platform?.name}</h3>
            <p className="text-sm text-gray-600">{platform?.category}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-indigo-600" />
              <span className="text-xs text-gray-600">Subscribers</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{platform?.subscribers?.toLocaleString()}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs text-gray-600">Revenue</span>
            </div>
            <p className="text-lg font-bold text-gray-900">₹{(platform?.revenue / 100000)?.toFixed(1)}L</p>
          </div>
        </div>

        {/* Plans */}
        <div className="mb-4">
          <p className="text-xs text-gray-600 mb-2">{platform?.plans?.length} Subscription Plans</p>
          <div className="flex flex-wrap gap-2">
            {platform?.plans?.slice(0, 3)?.map((plan, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-md"
              >
                {plan?.type} - ₹{plan?.price}
              </span>
            ))}
          </div>
        </div>

        {/* Credentials Info */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-900 font-medium">
                {platform?.credentials?.length || 0} Stored Credentials
              </span>
            </div>
            <CheckCircle className={`w-4 h-4 ${platform?.credentials?.length > 0 ? 'text-green-500' : 'text-gray-400'}`} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onManageCredentials(platform)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Key className="w-4 h-4" />
            Credentials
          </button>
          <button
            onClick={() => onEdit(platform?.id)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onRemove(platform?.id)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}