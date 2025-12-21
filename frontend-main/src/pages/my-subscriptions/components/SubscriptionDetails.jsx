// Code will be added manually
import React, { useState, useEffect } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { subscriptionsAPI, youtubeAPI } from '../../../services/api';

const SubscriptionDetailModal = ({ subscription, onClose, onUpdate, toast }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmail, setEditedEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [youtubeRequestStatus, setYoutubeRequestStatus] = useState(null);

  if (!subscription) return null;

  const isExpired = subscription?.status === 'expired';
  const isYoutube = subscription?.isYoutube || false;
  const isCombo = subscription?.isCombo || false;
  const canEditEmail = (isYoutube || isCombo) && 
                      subscription?.youtubeEmailEditCount < subscription?.youtubeEmailMaxEdits;

  // Fetch YouTube request status
  useEffect(() => {
    if ((isYoutube || isCombo) && subscription?.id) {
      fetchYoutubeRequestStatus();
    }
  }, [isYoutube, isCombo, subscription?.id]);

  const fetchYoutubeRequestStatus = async () => {
    try {
      const response = await youtubeAPI.getRequestBySubscription(subscription.id);
      setYoutubeRequestStatus(response.status);
    } catch (error) {
      console.error('Error fetching YouTube request status:', error);
    }
  };

  const validateEmail = (email) => {
    if (!email?.trim()) {
      return 'Gmail ID is required';
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid Gmail address (must end with @gmail.com)';
    }
    // Only check for duplicate if editing existing email
    if (subscription?.youtubeEmail && email === subscription?.youtubeEmail) {
      return 'New Gmail must be different from current Gmail';
    }
    return '';
  };

  const handleEditClick = () => {
    setEditedEmail(subscription?.youtubeEmail || '');
    setIsEditing(true);
    setError('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedEmail('');
    setError('');
  };

  const handleSaveEmail = async () => {
    const validationError = validateEmail(editedEmail);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      await subscriptionsAPI.updateYoutubeEmail(subscription.id, editedEmail);
      toast?.success('YouTube email updated successfully!');
      setIsEditing(false);
      setEditedEmail('');
      setError('');
      
      // Refresh YouTube request status
      await fetchYoutubeRequestStatus();
      
      // Call onUpdate to refresh subscription data
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating email:', error);
      toast?.error(error.message || 'Failed to update email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-foreground/40 z-[250] animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
        <div className="bg-background rounded-xl shadow-prominent max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
          <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-semibold text-foreground">Subscription Details</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-micro"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-border">
              <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center p-3">
                <Image 
                  src={subscription?.platformLogo} 
                  alt={subscription?.platformLogoAlt}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {subscription?.planName}
                </h3>
                <p className="text-sm text-muted-foreground">{subscription?.platform}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Calendar" size={18} color="var(--color-primary)" />
                  <p className="text-sm font-medium text-foreground">Purchase Date</p>
                </div>
                <p className="text-base font-semibold text-foreground">{subscription?.startDate || subscription?.purchaseDate}</p>
              </div>

              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="CalendarClock" size={18} color="var(--color-primary)" />
                  <p className="text-sm font-medium text-foreground">Expiry Date</p>
                </div>
                <p className="text-base font-semibold text-foreground">{subscription?.endDate || subscription?.expiryDate}</p>
              </div>
            </div>

            {!isExpired && (isYoutube || isCombo) && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="Mail" size={18} color="var(--color-primary)" />
                  <p className="text-sm font-medium text-primary">YouTube Gmail for Premium</p>
                </div>
                
                {youtubeRequestStatus === 'done' ? (
                  // Show completion message when admin marks as done
                  <div className="space-y-3">
                    <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="CheckCircle2" size={20} color="var(--color-success)" />
                        <p className="text-sm font-semibold text-success">Invitation Sent!</p>
                      </div>
                      <p className="text-xs text-foreground mb-3">
                        We have sent the YouTube Premium invitation to your Gmail. 
                        Please check your email inbox and accept the invitation.
                      </p>
                      <div className="bg-background rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Your Gmail</p>
                        <p className="font-mono text-sm text-foreground font-semibold">
                          {subscription?.youtubeEmail}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      iconName="ExternalLink"
                      iconPosition="right"
                      onClick={() => window.open('https://mail.google.com', '_blank')}
                    >
                      Open Gmail Inbox
                    </Button>
                  </div>
                ) : !isEditing ? (
                  <>
                    <div className="bg-background rounded-lg p-3 mb-3">
                      <p className="text-xs text-muted-foreground mb-1">Your Submitted Gmail</p>
                      <p className="font-mono text-sm text-foreground font-semibold">
                        {subscription?.youtubeEmail || 'No email submitted yet'}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="text-muted-foreground">Edit Status:</span>
                      <span className={`font-medium ${canEditEmail ? 'text-warning' : 'text-error'}`}>
                        {canEditEmail 
                          ? `${subscription?.youtubeEmailMaxEdits - subscription?.youtubeEmailEditCount} edit(s) remaining`
                          : 'No edits remaining'
                        }
                      </span>
                    </div>
                    
                    {canEditEmail && (
                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        iconName="Edit2"
                        iconPosition="left"
                        onClick={handleEditClick}
                      >
                        Edit Gmail
                      </Button>
                    )}
                    
                    {!canEditEmail && (
                      <div className="bg-error/10 border border-error/20 rounded-lg p-3">
                        <p className="text-xs text-error">
                          Maximum edit limit reached. Contact support if you need to change your Gmail.
                        </p>
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-3">
                      Our team will add this Gmail to the YouTube Family account within 24 hours
                    </p>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Input
                      label="New Gmail ID"
                      type="email"
                      placeholder="example@gmail.com"
                      value={editedEmail}
                      onChange={(e) => {
                        setEditedEmail(e?.target?.value);
                        if (error) setError('');
                      }}
                      error={error}
                      required
                    />
                    
                    <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Icon name="AlertCircle" size={16} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-foreground mb-1">Important Notes:</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Must be a fresh Gmail (no family already joined)</li>
                            <li>• You can only edit {subscription?.youtubeEmailMaxEdits} time(s)</li>
                            <li>• Cannot edit after reaching the limit</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        onClick={handleSaveEmail}
                        iconName="Check"
                        iconPosition="left"
                        loading={isLoading}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        iconName="X"
                        iconPosition="left"
                        disabled={isLoading}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!isExpired && isCombo && subscription?.credentials && (
              <div className="space-y-4">
                {/* Netflix Credentials */}
                {subscription?.credentials?.netflix && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon name="Film" size={18} color="#E50914" />
                      <p className="text-sm font-medium text-foreground">Netflix Premium</p>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-background rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Email/ID</p>
                        <p className="font-mono text-sm text-foreground font-semibold">{subscription?.credentials?.netflix?.email}</p>
                      </div>
                      <div className="bg-background rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Password</p>
                        <p className="font-mono text-sm text-foreground font-semibold">{subscription?.credentials?.netflix?.password}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Prime Video Credentials */}
                {subscription?.credentials?.prime && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon name="Play" size={18} color="#00A8E1" />
                      <p className="text-sm font-medium text-foreground">Amazon Prime Video</p>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-background rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Email/ID</p>
                        <p className="font-mono text-sm text-foreground font-semibold">{subscription?.credentials?.prime?.email}</p>
                      </div>
                      <div className="bg-background rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Password</p>
                        <p className="font-mono text-sm text-foreground font-semibold">{subscription?.credentials?.prime?.password}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pornhub Credentials */}
                {subscription?.credentials?.pornhub && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon name="Video" size={18} color="#FF9000" />
                      <p className="text-sm font-medium text-foreground">Pornhub Premium</p>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-background rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Email/ID</p>
                        <p className="font-mono text-sm text-foreground font-semibold">{subscription?.credentials?.pornhub?.email}</p>
                      </div>
                      <div className="bg-background rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Password</p>
                        <p className="font-mono text-sm text-foreground font-semibold">{subscription?.credentials?.pornhub?.password}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Warning Message for All Credentials */}
                <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Icon name="AlertTriangle" size={18} color="var(--color-error)" className="flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-error mb-1">⚠️ IMPORTANT WARNING</p>
                      <p className="text-xs text-foreground font-medium">
                        DON'T CHANGE PASSWORD OR LOCK PROFILE!
                      </p>
                      <p className="text-xs text-foreground mt-1">
                        IF FOUND TO DO SO THEN NO REPLACEMENT OR REFUND WILL BE PROVIDED
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Use these credentials to access your subscription on the platform
                </p>
              </div>
            )}

            {!isExpired && !isYoutube && !isCombo && subscription?.credentials && (
              <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="Key" size={18} color="var(--color-success)" />
                  <p className="text-sm font-medium text-success">Access Credentials</p>
                </div>
                <div className="space-y-3">
                  <div className="bg-background rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Email/ID</p>
                    <p className="font-mono text-sm text-foreground font-semibold">{subscription?.credentials?.email}</p>
                  </div>
                  <div className="bg-background rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Password</p>
                    <p className="font-mono text-sm text-foreground font-semibold">{subscription?.credentials?.password}</p>
                  </div>
                </div>
                
                <div className="bg-error/10 border border-error/20 rounded-lg p-3 mt-3">
                  <div className="flex items-start gap-2">
                    <Icon name="AlertTriangle" size={16} color="var(--color-error)" className="flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-error mb-1">⚠️ IMPORTANT WARNING</p>
                      <p className="text-xs text-foreground font-medium">
                        DON'T CHANGE PASSWORD OR LOCK PROFILE!
                      </p>
                      <p className="text-xs text-foreground mt-1">
                        IF FOUND TO DO SO THEN NO REPLACEMENT OR REFUND WILL BE PROVIDED
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mt-3">
                  Use these credentials to access your subscription on the platform
                </p>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-background border-t border-border px-6 py-4 flex gap-3">
            <Button variant="outline" fullWidth onClick={onClose}>
              Close
            </Button>
            {!isExpired && (
              <Button variant="default" fullWidth iconName="ExternalLink" iconPosition="left">
                Access Platform
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionDetailModal;