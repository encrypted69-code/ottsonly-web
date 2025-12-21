// Code will be added manually
import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';


const HeroSection = ({ onGetStarted, onBrowsePlans }) => {
  const trustIndicators = [
    {
      icon: "Shield",
      text: "Secure Payments",
      description: "SSL encrypted transactions"
    },
    {
      icon: "Zap",
      text: "Instant Access",
      description: "Immediate delivery"
    },
    {
      icon: "Headphones",
      text: "24/7 Support",
      description: "Always here to help"
    }
  ];

  return (
    <section className="relative bg-gradient-to-br from-[#E8F8F5] via-white to-[#F2F4F4] overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Icon name="TrendingDown" size={18} color="var(--color-primary)" />
              <span className="text-sm font-medium text-primary">Save Up to 90% on Premium OTT</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Premium Entertainment,
                <span className="text-primary"> Unbeatable Prices</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                Access Netflix, Prime Video, Hotstar, and more at prices that make sense. Legitimate subscriptions, instant delivery, guaranteed satisfaction.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="default"
                size="lg"
                iconName="ArrowRight"
                iconPosition="right"
                onClick={onGetStarted}
                className="shadow-moderate hover:shadow-prominent"
              >
                Get Started Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                iconName="ShoppingBag"
                iconPosition="left"
                onClick={onBrowsePlans}
              >
                Browse Plans
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
              {trustIndicators?.map((indicator, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-border shadow-subtle">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name={indicator?.icon} size={20} color="var(--color-primary)" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{indicator?.text}</p>
                    <p className="text-xs text-muted-foreground">{indicator?.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <div className="bg-white rounded-2xl shadow-prominent p-8 border border-border">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">N</span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Netflix Premium</p>
                        <p className="text-sm text-muted-foreground">1 Month</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-success/10 rounded-full">
                      <span className="text-success font-semibold text-sm">86% OFF</span>
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Original Price</span>
                      <span className="text-muted-foreground line-through">₹649</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Your Price</span>
                      <span className="text-2xl font-bold text-primary">₹89</span>
                    </div>
                  </div>

                  <Button variant="default" size="lg" fullWidth iconName="Check" iconPosition="left">
                    Instant Access
                  </Button>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/5 rounded-2xl -z-0" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary/5 rounded-2xl -z-0" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;