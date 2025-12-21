// Code will be added manually
import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SubscriptionCard = ({ subscription, onViewDetails, onGetAccess, onRenew }) => {
  const isActive = subscription?.status === 'active';
  const isExpiringSoon = subscription?.status === 'expiring_soon';
  const isExpired = subscription?.status === 'expired';

  const getStatusColor = () => {
    if (isActive) return 'bg-success/10 text-success border-success/20';
    if (isExpiringSoon) return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-muted text-muted-foreground border-border';
  };

  const getStatusIcon = () => {
    if (isActive) return 'CheckCircle2';
    if (isExpiringSoon) return 'AlertTriangle';
    return 'XCircle';
  };

  const calculateProgress = () => {
    if (isExpired) return 0;
    const total = new Date(subscription.expiryDate) - new Date(subscription.purchaseDate);
    const remaining = new Date(subscription.expiryDate) - new Date();
    return Math.max(0, Math.min(100, (remaining / total) * 100));
  };

  return (
    <div className={`bg-card border rounded-xl p-4 sm:p-6 transition-standard hover:shadow-moderate ${isExpired ? 'opacity-60' : ''}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-background rounded-lg flex items-center justify-center p-3 border border-border">
            <Image 
              src={subscription?.platformLogo} 
              alt={subscription?.platformLogoAlt}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground mb-1 truncate">
                {subscription?.planName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {subscription?.platform}
              </p>
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor()}`}>
              <Icon name={getStatusIcon()} size={14} />
              <span className="capitalize">{subscription?.status?.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Purchase Date</p>
              <p className="text-sm font-medium text-foreground">{subscription?.purchaseDate}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Expiry Date</p>
              <p className="text-sm font-medium text-foreground">{subscription?.expiryDate}</p>
            </div>
          </div>

          {!isExpired && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">Time Remaining</p>
                <p className="text-sm font-semibold text-foreground">{subscription?.remainingDays} days</p>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${isExpiringSoon ? 'bg-warning' : 'bg-success'}`}
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
            </div>
          )}

          {subscription?.accessCredentials && !isExpired && (
            <div className="bg-muted/50 rounded-lg p-3 mb-4">
              <p className="text-xs text-muted-foreground mb-2">Access Credentials</p>
              <div className="flex items-center gap-2">
                <Icon name="Key" size={16} color="var(--color-primary)" />
                <p className="text-sm font-mono text-foreground">{subscription?.accessCredentials}</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {!isExpired ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  iconName="Eye"
                  iconPosition="left"
                  onClick={() => onViewDetails(subscription)}
                >
                  View Details
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  iconName="ExternalLink"
                  iconPosition="left"
                  onClick={() => onGetAccess(subscription)}
                >
                  Get Access
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  iconName="Eye"
                  iconPosition="left"
                  onClick={() => onViewDetails(subscription)}
                >
                  View Details
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  iconName="RefreshCw"
                  iconPosition="left"
                  onClick={() => onRenew(subscription)}
                >
                  Renew Plan
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;