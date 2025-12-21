// Code will be added manually
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import NavigationBar from '../../components/ui/NavigationBar';
import { ToastContainer } from '../../components/ui/Toast';
import { useToast } from '../../hooks/useToast';
import Icon from '../../components/AppIcon';
import ProfileInformation from './components/ProfileInformation';
import SecuritySettings from './components/SecuritySettings';
import ContactVerification from './components/ContactVerification';
import AccountPreferences from './components/AccountPreferences';
import WalletInfo from './components/WalletInfo';
import AccountControl from './components/AccountControl';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { toasts, toast, removeToast } = useToast();

  const [user, setUser] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [preferences, setPreferences] = useState({
    orderUpdates: true,
    walletUpdates: true,
    offerNotifications: false
  });

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser({
          userId: parsedUser.id || '',
          fullName: parsedUser.name || '',
          username: parsedUser.email?.split('@')[0] || '',
          email: parsedUser.email || '',
          phoneNumber: parsedUser.phone || '',
          phoneVerified: parsedUser.phone_verified || false,
          emailVerified: parsedUser.email_verified || false,
          createdAt: parsedUser.created_at ? new Date(parsedUser.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''
        });
        setWalletBalance(parsedUser.wallet_balance || 0);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const handleProfileUpdate = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  const handlePreferencesUpdate = (updatedPrefs) => {
    setPreferences(updatedPrefs);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    toast?.info('Logging out...');
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  return (
    <>
      <Helmet>
        <title>Profile Settings - OTTSONLY</title>
        <meta name="description" content="Manage your OTTSONLY account settings, security, and preferences." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <NavigationBar
          user={user}
          walletBalance={walletBalance}
          onLogout={handleLogout}
        />

        <ToastContainer toasts={toasts} removeToast={removeToast} />

        <main className="pt-16 pb-20 lg:pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <Icon name="ArrowLeft" size={20} />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
                  <p className="text-muted-foreground mt-1">Manage your account information and preferences</p>
                </div>
              </div>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <ProfileInformation
                  user={user}
                  onUpdate={handleProfileUpdate}
                  toast={toast}
                />

                <SecuritySettings toast={toast} />

                <ContactVerification user={user} toast={toast} />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <AccountPreferences
                  preferences={preferences}
                  onUpdate={handlePreferencesUpdate}
                  toast={toast}
                />

                <WalletInfo walletBalance={walletBalance} />

                <AccountControl toast={toast} />
              </div>
            </div>

            {/* Info Banner */}
            <div className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Need Help?</p>
                  <p className="text-xs text-muted-foreground">
                    If you need assistance with your account or have questions about your settings, 
                    please contact our support team at support@ottsonly.com or call us at 1800-XXX-XXXX.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProfileSettings;
