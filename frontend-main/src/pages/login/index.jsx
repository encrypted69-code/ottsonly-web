// Code will be added manually
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/ui/Toast';
import LoginForm from './components/LoginForm';
import TrustIndicators from './components/TrustIndicators';

const Login = () => {
  const navigate = useNavigate();
  const { toasts, toast, removeToast } = useToast();

  const handleLoginSuccess = (message) => {
    toast?.success(message);
  };

  const handleLoginError = (message) => {
    toast?.error(message);
  };

  const ottPlatforms = [
  {
    name: 'Netflix',
    logo: "https://i.ibb.co/ynC8tdH9/netflixlogo.png",
    logoAlt: 'Netflix streaming service logo with red background and white text'
  },
  {
    name: 'Prime Video',
    logo: "https://i.ibb.co/gFJ2YxCr/primelogo.webp",
    logoAlt: 'Amazon Prime Video logo with blue background and white play button icon'
  },
  {
    name: 'Pornhub',
    logo: "https://i.ibb.co/Z6VTy4Bx/phublogo.png",
    logoAlt: 'Pornhub logo'
  },
  {
    name: 'YouTube Premium',
    logo: "https://i.ibb.co/fdFBHghg/ytlogo.png",
    logoAlt: 'YouTube Premium logo with red play button'
  }];


  return (
    <>
      <Helmet>
        <title>Login - OTTSONLY | Access Your OTT Subscriptions</title>
        <meta name="description" content="Login to OTTSONLY to manage your discounted OTT subscriptions. Secure OTP-based authentication for Netflix, Prime Video, Hotstar and more." />
      </Helmet>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="min-h-screen bg-background">
        <div className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-b border-border z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => navigate('/landing-page')}
                className="flex items-center gap-2 transition-micro hover:opacity-80">

                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Tv" size={24} color="var(--color-primary)" />
                </div>
                <span className="text-xl font-semibold text-foreground">OTTSONLY</span>
              </button>

              <button
                onClick={() => navigate('/landing-page')}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-micro">

                <Icon name="ArrowLeft" size={18} />
                <span className="hidden sm:inline">Back to Home</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="hidden lg:block space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                    <Icon name="Sparkles" size={18} color="var(--color-primary)" />
                    <span className="text-sm font-medium text-primary">Trusted by 50,000+ Users</span>
                  </div>
                  
                  <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                    Access Premium OTT
                    <br />
                    <span className="text-primary">at Unbeatable Prices</span>
                  </h1>
                  
                  <p className="text-lg text-muted-foreground">
                    Login to manage your subscriptions and enjoy up to 70% savings on Netflix, Prime Video, Hotstar, and more.
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-semibold text-foreground">Available Platforms</p>
                  <div className="grid grid-cols-4 gap-4">
                    {ottPlatforms?.map((platform, index) =>
                    <div
                      key={index}
                      className="aspect-square rounded-xl overflow-hidden border border-border bg-card hover:border-primary transition-standard">

                        <Image
                        src={platform?.logo}
                        alt={platform?.logoAlt}
                        className="w-full h-full object-cover" />

                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Icon name="Zap" size={20} color="var(--color-primary)" />
                      <p className="text-2xl font-bold text-foreground">Instant</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Access Delivery</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Icon name="Shield" size={20} color="var(--color-primary)" />
                      <p className="text-2xl font-bold text-foreground">100%</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Secure Payments</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Icon name="Headphones" size={20} color="var(--color-primary)" />
                      <p className="text-2xl font-bold text-foreground">24/7</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Support Available</p>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-md mx-auto lg:mx-0">
                <div className="bg-card border border-border rounded-2xl shadow-prominent p-6 sm:p-8">
                  <LoginForm
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginError} />

                </div>

                <TrustIndicators />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground text-center sm:text-left">
                © {new Date()?.getFullYear()} OTTSONLY. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/landing-page')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-micro">

                  Privacy Policy
                </button>
                <button
                  onClick={() => navigate('/landing-page')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-micro">

                  Terms of Service
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>);

};

export default Login;