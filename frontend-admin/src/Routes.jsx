import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import SubscriptionAnalytics from './pages/subscription-analytics';
import RevenueIntelligence from './pages/revenue-intelligence';
import OperationsMonitor from './pages/operations-monitor';
import UserBehaviorAnalytics from './pages/user-behavior-analytics';
import ExecutiveDashboard from './pages/executive-dashboard';
import UserAccountManagement from 'pages/user-account-management';
import OTTPlatformManagement from 'pages/ott-platform-management';
import OTTCredentialsDatabase from 'pages/ott-credentials-database';
import YouTube from './pages/youtube';
import IDP from './pages/idp';
import ReferralManagement from './pages/referral-management';
import NotificationCenter from './pages/notification-center';
import AdminLogin from './pages/admin-login';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/" element={<ExecutiveDashboard />} />
        <Route path="/subscription-analytics" element={<SubscriptionAnalytics />} />
        <Route path="/revenue-intelligence" element={<RevenueIntelligence />} />
        <Route path="/operations-monitor" element={<OperationsMonitor />} />
        <Route path="/user-behavior-analytics" element={<UserBehaviorAnalytics />} />
        <Route path="/executive-dashboard" element={<ExecutiveDashboard />} />
        <Route path="/user-account-management" element={<UserAccountManagement />} />
        <Route path="/ott-platform-management" element={<OTTPlatformManagement />} />
        <Route path="/ott-credentials-database" element={<OTTCredentialsDatabase />} />
        <Route path="/youtube" element={<YouTube />} />
        <Route path="/idp" element={<IDP />} />
        <Route path="/referral-management" element={<ReferralManagement />} />
        <Route path="/notification-center" element={<NotificationCenter />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
