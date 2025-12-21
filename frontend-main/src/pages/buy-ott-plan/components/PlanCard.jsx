// Code will be added manually
import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PlanCard = ({ plan, onBuyNow }) => {
  const savingsPercentage = plan?.originalPrice ? Math.round(((plan?.originalPrice - plan?.discountedPrice) / plan?.originalPrice) * 100) : null;

  // Combo plan layout
  if (plan?.isCombo) {
    return (
      <div className={`bg-card rounded-xl border ${plan?.popular ? 'border-primary ring-2 ring-primary/20' : 'border-border'} hover:shadow-md transition-standard overflow-hidden`}>
        <div className="p-6 space-y-4">
          {/* 4 Logo Boxes */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {plan?.logos?.map((logo, index) => (
              <div key={index} className="w-full aspect-square rounded-lg border-2 border-border bg-white flex items-center justify-center p-2">
                <Image 
                  src={logo} 
                  alt="OTT logo"
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="text-center">
            <span className="text-5xl font-bold text-foreground">₹149</span>
          </div>

          {/* Title */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground">combo plan</h3>
          </div>

          {/* Duration */}
          <div className="text-center">
            <span className="text-lg text-foreground">1 month</span>
          </div>

          {/* Features */}
          <div className="space-y-2">
            {plan?.features?.map((feature, index) => (
              <div key={index} className="text-sm text-foreground text-left">
                <span className="font-medium">{feature.toLowerCase()}</span>
              </div>
            ))}
          </div>

          {/* Badges */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-success">
              <Icon name="Zap" size={16} />
              <span className="text-xs font-medium">Instant Access</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Icon name="Shield" size={16} />
              <span className="text-xs font-medium">Secure</span>
            </div>
          </div>

          {/* Buy Button */}
          <Button
            variant="default"
            fullWidth
            onClick={() => onBuyNow?.(plan)}
            iconName="ShoppingCart"
            iconPosition="left"
          >
            Buy Now
          </Button>
        </div>
      </div>
    );
  }

  // Regular plan layout
  return (
    <div className={`bg-card rounded-xl border ${plan?.popular ? 'border-primary ring-2 ring-primary/20' : 'border-border'} hover:shadow-md transition-standard overflow-hidden`}>
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-border flex items-center justify-center p-2">
              <Image 
                src={plan?.logo} 
                alt={plan?.logoAlt}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{plan?.name}</h3>
              <p className="text-sm text-muted-foreground">{plan?.platform}</p>
            </div>
          </div>
          {savingsPercentage && (
            <div className="flex items-center gap-1 px-2 py-1 bg-success/10 rounded-md">
              <Icon name="TrendingDown" size={14} color="var(--color-success)" />
              <span className="text-xs font-semibold text-success">{savingsPercentage}% OFF</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-foreground">₹{plan?.discountedPrice?.toFixed(2)}</span>
            {plan?.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">₹{plan?.originalPrice?.toFixed(2)}</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={14} />
            <span>{plan?.duration} {plan?.duration === 1 ? 'Month' : 'Months'} Validity</span>
          </div>
        </div>

        <div className="space-y-2">
          {plan?.features?.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Icon name="Check" size={16} color="var(--color-success)" className="mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground">{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-md">
            <Icon name="Zap" size={14} color="var(--color-primary)" />
            <span className="text-xs font-medium text-primary">Instant Access</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
            <Icon name="Shield" size={14} color="var(--color-muted-foreground)" />
            <span className="text-xs font-medium text-muted-foreground">Secure</span>
          </div>
        </div>

        <Button
          variant="default"
          fullWidth
          iconName="ShoppingCart"
          iconPosition="left"
          onClick={() => onBuyNow(plan)}
          className="group-hover:shadow-moderate"
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
};

export default PlanCard;