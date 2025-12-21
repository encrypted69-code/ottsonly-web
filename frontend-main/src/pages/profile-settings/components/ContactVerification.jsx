// Code will be added manually
import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContactVerification = ({ user, toast }) => {
  const handleResendOTP = (type) => {
    toast?.success(`OTP sent to your ${type}`);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
          <Icon name="ShieldCheck" size={20} color="var(--color-success)" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Contact & Verification</h2>
          <p className="text-sm text-muted-foreground">Verify your contact information</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Phone Verification */}
        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                <Icon name="Smartphone" size={20} color="var(--color-primary)" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Phone Number</p>
                <p className="text-xs text-muted-foreground">{user?.phoneNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {user?.phoneVerified ? (
                <span className="flex items-center gap-1 px-3 py-1.5 bg-success/10 text-success text-xs font-medium rounded-lg border border-success/20">
                  <Icon name="CheckCircle2" size={14} />
                  Verified
                </span>
              ) : (
                <>
                  <span className="flex items-center gap-1 px-3 py-1.5 bg-warning/10 text-warning text-xs font-medium rounded-lg border border-warning/20">
                    <Icon name="AlertCircle" size={14} />
                    Unverified
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResendOTP('phone')}
                  >
                    Verify
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Email Verification */}
        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                <Icon name="Mail" size={20} color="var(--color-primary)" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Email Address</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {user?.emailVerified ? (
                <span className="flex items-center gap-1 px-3 py-1.5 bg-success/10 text-success text-xs font-medium rounded-lg border border-success/20">
                  <Icon name="CheckCircle2" size={14} />
                  Verified
                </span>
              ) : (
                <>
                  <span className="flex items-center gap-1 px-3 py-1.5 bg-warning/10 text-warning text-xs font-medium rounded-lg border border-warning/20">
                    <Icon name="AlertCircle" size={14} />
                    Unverified
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResendOTP('email')}
                  >
                    Verify
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactVerification;
