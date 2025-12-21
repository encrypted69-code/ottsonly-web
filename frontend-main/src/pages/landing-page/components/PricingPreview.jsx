// Code will be added manually
import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PricingPreview = ({ onViewAllPlans }) => {
  const featuredDeals = [
    {
      platform: "Netflix",
      plan: "Premium Plan",
      duration: "1 Month",
      originalPrice: "₹649",
      discountedPrice: "₹89",
      discount: "86%",
      features: [
        "Private Screen",
        "TV/Laptop Supported",
        "4K + HDR",
        "1 Month Validity"
      ],
      color: "from-red-500 to-red-600",
      popular: true
    },
    {
      platform: "Prime Video",
      plan: "Monthly Plan",
      duration: "1 Month",
      originalPrice: "₹299",
      discountedPrice: "₹35",
      discount: "88%",
      features: [
        "Private Single Screen",
        "HD 1080p",
        "No ads",
        "1 Month Validity"
      ],
      color: "from-blue-500 to-blue-600",
      popular: false
    },
    {
      platform: "YouTube Premium",
      plan: "Individual Plan",
      duration: "1 Month",
      originalPrice: "₹199",
      discountedPrice: "₹15",
      discount: "92%",
      features: [
        "No Ads",
        "Background Play",
        "YouTube Music",
        "On your mail"
      ],
      color: "from-red-500 to-red-600",
      popular: false
    },
    {
      platform: "Pornhub",
      plan: "Premium Plan",
      duration: "1 Month",
      originalPrice: "₹1499",
      discountedPrice: "₹69",
      discount: "95%",
      features: [
        "All contents unlocked",
        "Ads free",
        "Premium contents",
        "1 Month Validity"
      ],
      color: "from-orange-500 to-orange-600",
      popular: false
    }
  ];

  return (
    <section className="bg-gradient-to-br from-[#E8F8F5] to-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <Icon name="Tag" size={18} color="var(--color-primary)" />
            <span className="text-sm font-medium text-primary">Featured Deals</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Unbeatable Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Premium subscriptions at prices that actually make sense. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featuredDeals?.map((deal, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl border-2 p-8 transition-standard hover:shadow-prominent ${
                deal?.popular ? 'border-primary' : 'border-border'
              }`}
            >
              {deal?.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1 bg-primary rounded-full shadow-moderate">
                    <span className="text-white text-sm font-semibold">Most Popular</span>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-foreground">{deal?.platform}</h3>
                    <div className={`px-3 py-1 bg-gradient-to-r ${deal?.color} rounded-full`}>
                      <span className="text-white font-semibold text-sm">{deal?.discount} OFF</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{deal?.plan}</p>
                  <p className="text-sm text-muted-foreground">{deal?.duration}</p>
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-foreground">{deal?.discountedPrice}</span>
                    <span className="text-lg text-muted-foreground line-through">{deal?.originalPrice}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">One-time payment, full month access</p>
                </div>

                <div className="space-y-3">
                  {deal?.features?.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon name="Check" size={14} color="var(--color-success)" />
                      </div>
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  variant={deal?.popular ? "default" : "outline"}
                  size="lg"
                  fullWidth
                  iconName="ShoppingCart"
                  iconPosition="left"
                >
                  Get This Deal
                </Button>

                <div className="flex items-center justify-center gap-2 text-sm text-success">
                  <Icon name="Zap" size={16} color="var(--color-success)" />
                  <span>Instant Access</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center space-y-6">
          <p className="text-muted-foreground">
            Want to see more options? Browse our complete collection of OTT subscriptions
          </p>
          <Button
            variant="default"
            size="lg"
            iconName="ArrowRight"
            iconPosition="right"
            onClick={onViewAllPlans}
          >
            View All Plans
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-border text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Shield" size={24} color="var(--color-primary)" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">100% Secure</h4>
            <p className="text-sm text-muted-foreground">SSL encrypted payments with trusted gateways</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-border text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Award" size={24} color="var(--color-primary)" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Verified Subscriptions</h4>
            <p className="text-sm text-muted-foreground">100% legitimate and working subscriptions</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-border text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Headphones" size={24} color="var(--color-primary)" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">24/7 Support</h4>
            <p className="text-sm text-muted-foreground">Always available to help with any questions</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPreview;