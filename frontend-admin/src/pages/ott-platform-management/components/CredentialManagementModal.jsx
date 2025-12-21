import { X, Plus, Trash2, Eye, EyeOff, Key, CheckCircle, XCircle } from 'lucide-react';

export default function CredentialManagementModal({ platform, onClose, onSave }) {
  const [credentials, setCredentials] = useState(platform?.credentials || []);
  const [showPasswords, setShowPasswords] = useState({});
  const [newCredential, setNewCredential] = useState({
    email: '',
    password: '',
    plan: platform?.plans?.[0]?.type || '',
    status: 'active'
  });

  const togglePasswordVisibility = (id) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev?.[id]
    }));
  };

  const handleAddCredential = () => {
    if (!newCredential?.email || !newCredential?.password || !newCredential?.plan) {
      alert('Please fill all fields');
      return;
    }

    const credential = {
      id: credentials?.length + 1,
      ...newCredential
    };

    setCredentials([...credentials, credential]);
    setNewCredential({
      email: '',
      password: '',
      plan: platform?.plans?.[0]?.type || '',
      status: 'active'
    });
  };

  const handleRemoveCredential = (id) => {
    setCredentials(credentials?.filter(c => c?.id !== id));
  };

  const handleStatusToggle = (id) => {
    setCredentials(credentials?.map(c =>
      c?.id === id ? { ...c, status: c?.status === 'active' ? 'inactive' : 'active' } : c
    ));
  };

  const handleSave = () => {
    onSave(credentials);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Key className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Manage Credentials</h2>
              <p className="text-sm text-gray-600">{platform?.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Add New Credential Form */}
          <div className="bg-gray-50 rounded-lg p-5 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Add New Credential</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="email"
                value={newCredential?.email}
                onChange={(e) => setNewCredential({ ...newCredential, email: e?.target?.value })}
                placeholder="Email/Username"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="password"
                value={newCredential?.password}
                onChange={(e) => setNewCredential({ ...newCredential, password: e?.target?.value })}
                placeholder="Password"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <select
                value={newCredential?.plan}
                onChange={(e) => setNewCredential({ ...newCredential, plan: e?.target?.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {platform?.plans?.map((plan, index) => (
                  <option key={index} value={plan?.type}>
                    {plan?.type} - ₹{plan?.price}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddCredential}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {/* Credentials List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 mb-3">
              Stored Credentials ({credentials?.length})
            </h3>
            {credentials?.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Key className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No credentials stored yet</p>
                <p className="text-sm text-gray-500 mt-1">Add credentials to start managing accounts</p>
              </div>
            ) : (
              credentials?.map((credential) => (
                <div
                  key={credential?.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Email/Username */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Email/Username</p>
                        <p className="font-medium text-gray-900">{credential?.email}</p>
                      </div>

                      {/* Password */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Password</p>
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-sm text-gray-900">
                            {showPasswords?.[credential?.id] ? credential?.password : '••••••••'}
                          </p>
                          <button
                            onClick={() => togglePasswordVisibility(credential?.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords?.[credential?.id] ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Plan */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Plan</p>
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-md">
                          {credential?.plan}
                        </span>
                      </div>

                      {/* Status */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Status</p>
                        <button
                          onClick={() => handleStatusToggle(credential?.id)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
                            credential?.status === 'active' ?'bg-green-100 text-green-700' :'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {credential?.status === 'active' ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              Inactive
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <button
                      onClick={() => handleRemoveCredential(credential?.id)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            Total: <span className="font-semibold">{credentials?.length}</span> credentials
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}