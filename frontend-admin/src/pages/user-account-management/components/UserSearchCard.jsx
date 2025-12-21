import { Search, User, CheckCircle, XCircle } from 'lucide-react';

export default function UserSearchCard({ searchQuery, setSearchQuery, users, onUserSelect }) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleUserClick = (user) => {
    onUserSelect(user);
    setShowSuggestions(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-900">Search User</h3>
      </div>
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e?.target?.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search by username or email..."
          className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />

        {/* Suggestions Dropdown */}
        {showSuggestions && searchQuery && users?.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
            {users?.map((user) => (
              <div
                key={user?.id}
                onClick={() => handleUserClick(user)}
                className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user?.username}</p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{user?.balance?.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {user?.status === 'active' ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-green-600">Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="text-xs text-red-600">Blocked</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-600">Results</p>
          <p className="text-lg font-semibold text-gray-900">{users?.length}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Active</p>
          <p className="text-lg font-semibold text-green-600">
            {users?.filter(u => u?.status === 'active')?.length}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Blocked</p>
          <p className="text-lg font-semibold text-red-600">
            {users?.filter(u => u?.status === 'blocked')?.length}
          </p>
        </div>
      </div>
    </div>
  );
}