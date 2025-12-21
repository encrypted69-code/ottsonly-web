// Code will be added manually
import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import WalletAndPayments from './pages/wallet-and-payments';
import Registration from './pages/registration';
import Login from './pages/login';
import BuyOTTPlan from './pages/buy-ott-plan';
import LandingPage from './pages/landing-page';
import MySubscriptions from './pages/my-subscriptions';
import Dashboard from './pages/dashboard';
import Refer from './pages/refer';
import YouTubeGmailRequest from './pages/youtube-gmail-request';
import ProfileSettings from './pages/profile-settings';
import ReferralPage from './pages/referral';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wallet-and-payments" element={<WalletAndPayments />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/buy-ott-plan" element={<BuyOTTPlan />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/my-subscriptions" element={<MySubscriptions />} />
        <Route path="/refer" element={<Refer />} />
        <Route path="/referral" element={<ReferralPage />} />
        <Route path="/youtube-gmail-request" element={<YouTubeGmailRequest />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
