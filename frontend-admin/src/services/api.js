// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// API Client with error handling
const apiClient = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/admin-login';
      return;
    }
    
    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.detail || data.message || 'Request failed';
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    // If it's already an Error with a message, throw it
    if (error instanceof Error) {
      throw error;
    }
    // Otherwise create a new Error with string representation
    throw new Error(String(error));
  }
};

// Admin Auth APIs
export const authAPI = {
  login: (credentials) =>
    apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  logout: () =>
    apiClient('/auth/logout', {
      method: 'POST',
    }),

  getProfile: () => apiClient('/auth/me'),
};

// Admin User Management APIs
export const userAPI = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.skip !== undefined) queryParams.append('skip', params.skip);
    if (params.limit !== undefined) queryParams.append('limit', params.limit);
    
    const queryString = queryParams.toString();
    return apiClient(`/admin/users${queryString ? `?${queryString}` : ''}`);
  },

  getById: (userId) => apiClient(`/admin/users/${userId}`),

  blockUser: (userId) =>
    apiClient(`/admin/users/${userId}/block`, {
      method: 'POST',
    }),

  unblockUser: (userId) =>
    apiClient(`/admin/users/${userId}/unblock`, {
      method: 'POST',
    }),

  forceLogout: (userId) =>
    apiClient(`/admin/users/${userId}/force-logout`, {
      method: 'POST',
    }),

  creditWallet: (userId, amount, reason) =>
    apiClient(`/admin/users/${userId}/wallet-credit?amount=${amount}&reason=${encodeURIComponent(reason)}`, {
      method: 'POST',
    }),

  debitWallet: (userId, amount, reason) =>
    apiClient(`/admin/users/${userId}/wallet-debit?amount=${amount}&reason=${encodeURIComponent(reason)}`, {
      method: 'POST',
    }),
};

// Admin YouTube Management APIs
export const youtubeAPI = {
  getRequests: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.skip !== undefined) queryParams.append('skip', params.skip);
    if (params.limit !== undefined) queryParams.append('limit', params.limit);
    
    const queryString = queryParams.toString();
    return apiClient(`/admin/youtube/requests${queryString ? `?${queryString}` : ''}`);
  },

  markDone: (requestId, notes) =>
    apiClient(`/admin/youtube/${requestId}/done`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    }),

  undo: (requestId, reason) =>
    apiClient(`/admin/youtube/${requestId}/undo`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
};

// Admin Orders APIs
export const orderAPI = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.skip !== undefined) queryParams.append('skip', params.skip);
    if (params.limit !== undefined) queryParams.append('limit', params.limit);
    
    const queryString = queryParams.toString();
    return apiClient(`/admin/orders${queryString ? `?${queryString}` : ''}`);
  },

  getById: (orderId) => apiClient(`/admin/orders/${orderId}`),
};

// Admin Products APIs
export const productAPI = {
  getAll: () => apiClient('/products'),
  
  getById: (id) => apiClient(`/products/${id}`),

  create: (productData) =>
    apiClient('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),

  update: (id, productData) =>
    apiClient(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }),

  delete: (id) =>
    apiClient(`/admin/products/${id}`, {
      method: 'DELETE',
    }),
};

// Admin Dashboard Stats APIs
export const statsAPI = {
  getDashboard: () => apiClient('/admin/stats/dashboard'),
  getRevenue: (period) => apiClient(`/admin/stats/revenue?period=${period}`),
  getUserGrowth: () => apiClient('/admin/stats/user-growth'),
};

// Admin Credentials APIs
export const credentialsAPI = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.platform) queryParams.append('platform', params.platform);
    if (params.is_active !== undefined) queryParams.append('is_active', params.is_active);
    if (params.skip !== undefined) queryParams.append('skip', params.skip);
    if (params.limit !== undefined) queryParams.append('limit', params.limit);
    
    const queryString = queryParams.toString();
    return apiClient(`/admin/credentials${queryString ? `?${queryString}` : ''}`);
  },

  getById: (credentialId) => apiClient(`/admin/credentials/${credentialId}`),

  create: (credentialData) =>
    apiClient('/admin/credentials', {
      method: 'POST',
      body: JSON.stringify(credentialData),
    }),

  update: (credentialId, credentialData) =>
    apiClient(`/admin/credentials/${credentialId}`, {
      method: 'PUT',
      body: JSON.stringify(credentialData),
    }),

  delete: (credentialId) =>
    apiClient(`/admin/credentials/${credentialId}`, {
      method: 'DELETE',
    }),
};

// Admin Referral APIs
export const referralAPI = {
  getStats: () => apiClient('/admin/referrals/stats'),

  getPendingWithdrawals: async () => {
    const response = await apiClient('/admin/referrals/withdrawals/pending');
    return response.withdrawals || [];
  },

  getAllWithdrawals: async () => {
    const response = await apiClient('/admin/referrals/withdrawals/all');
    return response.withdrawals || [];
  },

  getCommissions: async () => {
    const response = await apiClient('/admin/referrals/commissions');
    return response.commissions || [];
  },

  processWithdrawal: (withdrawalId, data) =>
    apiClient(`/admin/referrals/withdrawals/${withdrawalId}/process`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

export const notificationAPI = {
  // Send bulk notification to customers
  sendBulkNotification: (data) =>
    apiClient('/notifications/bulk', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Get notification send history
  getHistory: async (skip = 0, limit = 50) => {
    const response = await apiClient(`/notifications/admin/history?skip=${skip}&limit=${limit}`);
    return response.history || [];
  },

  // Get notification statistics
  getStats: async () => {
    const response = await apiClient('/notifications/admin/stats');
    return response;
  },
};

export default {
  auth: authAPI,
  user: userAPI,
  youtube: youtubeAPI,
  order: orderAPI,
  product: productAPI,
  stats: statsAPI,
  credentials: credentialsAPI,
  referral: referralAPI,
  notification: notificationAPI,
};
