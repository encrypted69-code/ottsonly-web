// Code will be added manually
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { ToastContainer } from '../../components/ui/Toast';
import { useToast } from '../../hooks/useToast';

const YouTubeGmailRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toasts, toast, removeToast } = useToast();

  const [gmailId, setGmailId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Get order details from navigation state
  const orderDetails = location?.state || {
    orderId: 'YT' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    userId: 'USER123',
    username: 'John Doe',
    planName: 'YouTube Premium',
    amount: 199
  };

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = true; // Replace with actual auth check
    if (!isLoggedIn) {
      toast?.error('Please login to continue');
      navigate('/login');
    }
  }, [navigate, toast]);

  const validateGmail = (email) => {
    if (!email?.trim()) {
      return 'Gmail ID is required';
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid Gmail address (must end with @gmail.com)';
    }

    return '';
  };

  const handleInputChange = (e) => {
    const value = e?.target?.value;
    setGmailId(value);
    
    if (error) {
      const validationError = validateGmail(value);
      setError(validationError);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    const validationError = validateGmail(gmailId);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Check if we have subscription_id from order
      const subscriptionId = orderDetails?.subscriptionId;
      
      if (!subscriptionId) {
        throw new Error('Subscription ID not found. Please contact support.');
      }

      // Update subscription with YouTube email using the API
      const { subscriptionsAPI } = await import('../../services/api');
      await subscriptionsAPI.updateYoutubeEmail(subscriptionId, gmailId);

      setIsSubmitted(true);
      toast?.success('Gmail submitted successfully! You will be added shortly.');

      setTimeout(() => {
        navigate('/my-subscriptions');
      }, 3000);

    } catch (error) {
      console.error('Error submitting Gmail:', error);
      toast?.error(error.message || 'Failed to submit Gmail. Please try again.');
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <Helmet>
          <title>Gmail Submitted - OTTSONLY</title>
        </Helmet>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <ToastContainer toasts={toasts} removeToast={removeToast} />
          <div className="w-full max-w-md">
            <div className="bg-card rounded-2xl border border-border p-8 shadow-prominent text-center space-y-6">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <Icon name="CheckCircle2" size={40} color="var(--color-success)" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Gmail Submitted Successfully!</h2>
                <p className="text-muted-foreground">
                  You will be automatically added to our YouTube Family account shortly.
                </p>
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Icon name="Info" size={20} color="var(--color-primary)" className="flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">What's Next?</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Our team will review and add your Gmail to the family account within 24 hours. Check your subscriptions for updates.
                    </p>
                  </div>
                </div>
              </div>
              <Button
                variant="default"
                fullWidth
                onClick={() => navigate('/my-subscriptions')}
                iconName="ArrowRight"
                iconPosition="right"
              >
                View My Subscriptions
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Submit Gmail for YouTube - OTTSONLY</title>
        <meta name="description" content="Submit your Gmail ID to get added to YouTube Family account automatically." />
      </Helmet>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
              <Icon name="Mail" size={32} color="var(--color-primary)" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Submit Your Gmail</h1>
            <p className="text-muted-foreground">
              Provide your Gmail ID to join our YouTube Family account
            </p>
          </div>

          {/* Order Summary */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Order Details</span>
              <span className="text-xs font-mono text-muted-foreground">{orderDetails?.orderId}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Youtube" size={24} color="var(--color-primary)" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{orderDetails?.planName}</p>
                <p className="text-xs text-muted-foreground">Purchase successful</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">₹{orderDetails?.amount}</p>
              </div>
            </div>
          </div>

          {/* Gmail Submission Form */}
          <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-moderate">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Input
                  label="Gmail ID"
                  type="email"
                  placeholder="example@gmail.com"
                  value={gmailId}
                  onChange={handleInputChange}
                  error={error}
                  required
                  disabled={isLoading}
                />
                
                {/* Helper Text */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                      <Icon name="Mail" size={18} color="var(--color-primary)" />
                    </div>
                    <p>Please send your Gmail ID for automatic family addition</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                      <Icon name="AlertTriangle" size={18} color="var(--color-warning)" />
                    </div>
                    <p>Must be fresh Gmail (no family joined)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                      <Icon name="Target" size={18} color="var(--color-success)" />
                    </div>
                    <p>You will be automatically added to our family account!</p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                variant="default"
                fullWidth
                loading={isLoading}
                disabled={!gmailId || isLoading}
                iconName="Send"
                iconPosition="left"
              >
                Submit Gmail
              </Button>
            </form>
          </div>

          {/* Security Note */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="ShieldCheck" size={20} color="var(--color-success)" className="flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">Secure & Private</p>
                <p className="text-xs text-muted-foreground">
                  Your Gmail ID is safely stored and only used for YouTube Family account addition. We respect your privacy.
                </p>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <Button
            variant="ghost"
            fullWidth
            onClick={() => navigate('/my-subscriptions')}
            iconName="ArrowLeft"
            iconPosition="left"
            disabled={isLoading}
          >
            Back to Subscriptions
          </Button>
        </div>
      </div>
    </>
  );
};

export default YouTubeGmailRequest;
