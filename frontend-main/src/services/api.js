// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

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
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    
    // Try to parse JSON response
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      // If JSON parsing fails, throw a more specific error
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      // Handle validation errors from FastAPI
      if (data.detail) {
        if (typeof data.detail === 'string') {
          throw new Error(data.detail);
        } else if (Array.isArray(data.detail)) {
          // Handle validation error array
          const errorMsg = data.detail.map(err => err.msg || err.message).join(', ');
          throw new Error(errorMsg || 'Validation error');
        } else if (typeof data.detail === 'object') {
          throw new Error(data.detail.message || JSON.stringify(data.detail));
        }
      }
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    // Ensure we always throw a proper Error object with a message
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error) || 'An unexpected error occurred');
  }
};

// Auth APIs
export const authAPI = {
  register: (userData) =>
    apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    apiClient('/auth/user/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  verifyOTP: (data) =>
    apiClient('/auth/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiClient('/auth/logout', {
      method: 'POST',
    }),

  getProfile: () => apiClient('/auth/me'),

  refreshToken: (refreshToken) =>
    apiClient('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    }),
};

// User APIs
export const userAPI = {
  getProfile: () => apiClient('/user/profile'),
  
  updateProfile: (data) =>
    apiClient('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  changePassword: (data) =>
    apiClient('/user/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient('/user/upload-avatar', {
      method: 'POST',
      headers: {},
      body: formData,
    });
  },

  getActivity: () => apiClient('/user/activity'),
};

// Wallet APIs
export const walletAPI = {
  getBalance: () => apiClient('/wallet/balance'),
  getHistory: () => apiClient('/wallet/history'),
  getTransactions: () => apiClient('/wallet/transactions'),
  
  // Razorpay integration
  addMoney: (amount) =>
    apiClient('/wallet/add-money', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),
  
  verifyPayment: (paymentData) =>
    apiClient('/wallet/verify-payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),
};

// Products APIs
export const productsAPI = {
  getAll: () => apiClient('/products'),
  getById: (id) => apiClient(`/products/${id}`),
};

// Orders APIs
export const ordersAPI = {
  create: (orderData) =>
    apiClient('/orders/', {
      method: 'POST',
      body: JSON.stringify({ product_id: orderData.product_id }),
    }),

  getMyOrders: () => apiClient('/orders/my-orders'),
  
  getById: (orderId) => apiClient(`/orders/${orderId}`),
};

// Subscriptions APIs
export const subscriptionsAPI = {
  getMySubscriptions: () => apiClient('/subscriptions/my-subscriptions'),
  
  getById: (subscriptionId) => apiClient(`/subscriptions/${subscriptionId}`),
  
  updateYoutubeEmail: (subscriptionId, email) =>
    apiClient(`/subscriptions/${subscriptionId}/update-youtube-email`, {
      method: 'PUT',
      body: JSON.stringify({ email }),
    }),
};

// YouTube APIs
export const youtubeAPI = {
  submitRequest: (data) =>
    apiClient('/youtube/request', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getRequestStatus: () => apiClient('/youtube/request/status'),
  
  getRequestBySubscription: (subscriptionId) => 
    apiClient(`/youtube/request/subscription/${subscriptionId}`),

  editRequest: (data) =>
    apiClient('/youtube/request/edit', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// History APIs
export const historyAPI = {
  getPurchases: () => apiClient('/history/purchases'),
  getTransactions: () => apiClient('/history/transactions'),
  getYouTube: () => apiClient('/history/youtube'),
};

// Admin APIs
export const adminAPI = {
  // Users
  getUsers: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/admin/users?${queryString}`);
  },

  getUserById: (userId) => apiClient(`/admin/users/${userId}`),

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
    apiClient(`/admin/users/${userId}/wallet-credit`, {
      method: 'POST',
      body: JSON.stringify({ amount, reason }),
    }),

  debitWallet: (userId, amount, reason) =>
    apiClient(`/admin/users/${userId}/wallet-debit`, {
      method: 'POST',
      body: JSON.stringify({ amount, reason }),
    }),

  // YouTube Requests
  getYouTubeRequests: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/admin/youtube/requests?${queryString}`);
  },

  markYouTubeDone: (requestId, notes) =>
    apiClient(`/admin/youtube/${requestId}/done`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    }),

  undoYouTube: (requestId, reason) =>
    apiClient(`/admin/youtube/${requestId}/undo`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
};

// Referral APIs
export const referralAPI = {
  getMyCode: () => apiClient('/referrals/my-code'),
  
  applyCode: (referralCode) =>
    apiClient('/referrals/apply', {
      method: 'POST',
      body: JSON.stringify({ referral_code: referralCode }),
    }),

  getDashboard: () => apiClient('/referrals/dashboard'),

  requestWithdrawal: (data) =>
    apiClient('/referrals/withdraw', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getWithdrawalHistory: () => apiClient('/referrals/withdrawal-history'),
};

export default {
  auth: authAPI,
  user: userAPI,
  wallet: walletAPI,
  products: productsAPI,
  orders: ordersAPI,
  youtube: youtubeAPI,
  history: historyAPI,
  admin: adminAPI,
  referral: referralAPI,};