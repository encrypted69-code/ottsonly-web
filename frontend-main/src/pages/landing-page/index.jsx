// Code will be added manually
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import HeroSection from './components/HeroSection';
import PlatformShowcase from './components/PlatformShowcase';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import PricingPreview from './components/PricingPreview';
import Footer from './components/Footer';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/registration');
  };

  const handleBrowsePlans = () => {
    navigate('/buy-ott-plan');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <Helmet>
        <title>OTTSONLY - Premium OTT Subscriptions at Up to 70% Off</title>
        <meta name="description" content="Get Netflix, Prime Video, Hotstar, and more at unbeatable prices. Secure payments, instant access, and 24/7 support. Save up to 90% on premium streaming services." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-border z-50 shadow-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/landing-page')}>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Tv" size={24} color="var(--color-primary)" />
                </div>
                <span className="text-xl font-semibold text-foreground">OTTSONLY</span>
              </div>

              <div className="hidden md:flex items-center gap-8">
                <button
                  onClick={() => navigate('/buy-ott-plan')}
                  className="text-sm font-medium text-foreground hover:text-primary transition-micro"
                >
                  Browse Plans
                </button>
                <button
                  onClick={() => navigate('/support')}
                  className="text-sm font-medium text-foreground hover:text-primary transition-micro"
                >
                  Support
                </button>
                <button
                  onClick={() => navigate('/faq')}
                  className="text-sm font-medium text-foreground hover:text-primary transition-micro"
                >
                  FAQ
                </button>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="default"
                  onClick={handleLogin}
                  className="hidden sm:flex"
                >
                  Login
                </Button>
                <Button
                  variant="default"
                  size="default"
                  iconName="ArrowRight"
                  iconPosition="right"
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <div className="pt-16">
          <HeroSection 
            onGetStarted={handleGetStarted}
            onBrowsePlans={handleBrowsePlans}
          />
          
          <PlatformShowcase />
          
          <HowItWorks />
          
          <Testimonials />
          
          <PricingPreview onViewAllPlans={handleBrowsePlans} />
          
          <section className="bg-gradient-to-r from-primary to-secondary py-16 lg:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Start Saving?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Join 50,000+ satisfied customers and start enjoying premium OTT content at prices that make sense. Get instant access to your favorite streaming platforms today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  variant="secondary"
                  size="lg"
                  iconName="UserPlus"
                  iconPosition="left"
                  onClick={handleGetStarted}
                  className="shadow-prominent"
                >
                  Create Free Account
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  iconName="PlayCircle"
                  iconPosition="left"
                  onClick={handleBrowsePlans}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  Explore Plans
                </Button>
              </div>
              <div className="mt-8 flex items-center justify-center gap-8 flex-wrap text-white/80">
                <div className="flex items-center gap-2">
                  <Icon name="CheckCircle2" size={20} color="white" />
                  <span className="text-sm">No Hidden Fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="CheckCircle2" size={20} color="white" />
                  <span className="text-sm">Instant Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="CheckCircle2" size={20} color="white" />
                  <span className="text-sm">24/7 Support</span>
                </div>
              </div>
            </div>
          </section>
          
          <Footer />
        </div>
      </div>
    </>
  );
};

export default LandingPage;