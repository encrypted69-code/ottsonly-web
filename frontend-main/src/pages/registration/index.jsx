import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import { ToastContainer } from '../../components/ui/Toast';
import { useToast } from '../../hooks/useToast';
import RegistrationForm from './components/RegistrationForm';
import OTPVerification from './components/OTPVerification';
import TermsAgreement from './components/TermsAgreement';
import ProgressIndicator from './components/ProgressIndicator';
import TrustBadges from './components/TrustBadges';
import { authAPI } from '../../services/api';

const Registration = () => {
  const navigate = useNavigate();
  const { toasts, toast, removeToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [termsError, setTermsError] = useState('');

  const handleFormSubmit = (formData) => {
    setUserData(formData);
    setCurrentStep(2);
  };

  const handlePasswordSubmit = async (passwordData) => {
    if (!termsAgreed) {
      setTermsError('You must agree to the Terms & Conditions to continue');
      return;
    }

    setIsLoading(true);

    try {
      // Combine user data with password and map field names correctly
      const registrationData = {
        name: userData.fullName,  // Map fullName to name
        email: userData.email,
        phone: userData.phone,
        password: passwordData.password,
      };
      
      // Only include referral_code if it has a value
      if (userData.referralCode && userData.referralCode.trim()) {
        registrationData.referral_code = userData.referralCode.trim().toUpperCase();
      }

      console.log('Sending registration data:', registrationData);

      // Call backend registration API
      const response = await authAPI.register(registrationData);

      // Store tokens
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.user));

      setCurrentStep(3);
      toast?.success('Account created successfully! Redirecting to dashboard...');

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      // Extract error message properly
      let errorMessage = 'Failed to create account. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast?.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTermsChange = (e) => {
    setTermsAgreed(e?.target?.checked);
    if (e?.target?.checked) {
      setTermsError('');
    }
  };

  const handleBackToForm = () => {
    setCurrentStep(1);
    setTermsAgreed(false);
    setTermsError('');
  };

  return (
    <>
      <Helmet>
        <title>Create Account - OTTSONLY</title>
        <meta name="description" content="Join OTTSONLY and get access to premium OTT subscriptions at discounted prices. Quick and secure registration process." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <ToastContainer toasts={toasts} removeToast={removeToast} />

        <div className="flex flex-col lg:flex-row min-h-screen">
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-12 items-center justify-center">
            <div className="max-w-md space-y-8">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                  <Icon name="Tv" size={32} color="var(--color-primary)" />
                </div>
                <h1 className="text-4xl font-bold text-foreground">
                  Welcome to OTTSONLY
                </h1>
                <p className="text-lg text-muted-foreground">
                  Join thousands of users enjoying premium OTT subscriptions at up to 70% off. Start streaming your favorite content today!
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="Zap" size={20} color="var(--color-primary)" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Instant Access</h3>
                    <p className="text-sm text-muted-foreground">
                      Get your subscription details immediately after purchase
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="Shield" size={20} color="var(--color-primary)" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Secure Payments</h3>
                    <p className="text-sm text-muted-foreground">
                      Your transactions are protected with bank-grade encryption
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="HeadphonesIcon" size={20} color="var(--color-primary)" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">24/7 Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Our team is always here to help you with any questions
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <Image
                  src="https://images.unsplash.com/photo-1714978444525-c0f3f1a7b9c9"
                  alt="Happy diverse group of young people watching streaming content together on laptop with excited expressions in modern living room setting"
                  className="w-full h-64 object-cover rounded-2xl shadow-prominent" />

              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
            <div className="w-full max-w-md space-y-8">
              <div className="text-center lg:text-left space-y-2">
                <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Tv" size={24} color="var(--color-primary)" />
                  </div>
                  <span className="text-xl font-semibold text-foreground">OTTSONLY</span>
                </div>

                <h2 className="text-3xl font-bold text-foreground">Create Account</h2>
                <p className="text-muted-foreground">
                  {currentStep === 1 && 'Enter your details to get started'}
                  {currentStep === 2 && 'Create a secure password for your account'}
                  {currentStep === 3 && 'Account created successfully!'}
                </p>
              </div>

              <ProgressIndicator currentStep={currentStep} />

              <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-moderate">
                {currentStep === 1 &&
                <RegistrationForm
                  onSubmit={handleFormSubmit}
                  isLoading={isLoading} />

                }

                {currentStep === 2 && userData &&
                <div className="space-y-6">
                    <OTPVerification
                    phone={userData?.phone}
                    email={userData?.email}
                    onVerify={handlePasswordSubmit}
                    isLoading={isLoading} />


                    <TermsAgreement
                    checked={termsAgreed}
                    onChange={handleTermsChange}
                    error={termsError} />


                    <Button
                    variant="ghost"
                    fullWidth
                    onClick={handleBackToForm}
                    iconName="ArrowLeft"
                    iconPosition="left">

                      Back to Details
                    </Button>
                  </div>
                }

                {currentStep === 3 &&
                <div className="text-center space-y-6 py-8">
                    <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                      <Icon name="CheckCircle2" size={40} color="var(--color-success)" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-foreground">
                        Welcome to OTTSONLY!
                      </h3>
                      <p className="text-muted-foreground">
                        Your account has been created successfully. Redirecting to dashboard...
                      </p>
                    </div>
                  </div>
                }
              </div>

              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <button
                    onClick={() => navigate('/login')}
                    className="text-primary hover:underline font-medium">

                    Sign in here
                  </button>
                </p>

                <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                  <button
                    onClick={() => navigate('/terms-and-conditions')}
                    className="hover:text-foreground transition-micro">

                    Terms
                  </button>
                  <span>&bull;</span>
                  <button
                    onClick={() => navigate('/privacy-policy')}
                    className="hover:text-foreground transition-micro">

                    Privacy
                  </button>
                  <span>&bull;</span>
                  <button
                    onClick={() => navigate('/support')}
                    className="hover:text-foreground transition-micro">

                    Support
                  </button>
                </div>
              </div>

              <TrustBadges />
            </div>
          </div>
        </div>
      </div>
    </>);

};

export default Registration;