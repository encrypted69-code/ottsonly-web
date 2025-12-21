// Code will be added manually
import React from 'react';
import Icon from '../../../components/AppIcon';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: "UserPlus",
      title: "Create Your Account",
      description: "Sign up in seconds with your email or phone number. Quick verification process ensures your account security.",
      color: "from-blue-500 to-blue-600"
    },
    {
      number: "02",
      icon: "Search",
      title: "Choose Your Plan",
      description: "Browse through our extensive collection of OTT subscriptions. Filter by platform, duration, and price to find your perfect match.",
      color: "from-purple-500 to-purple-600"
    },
    {
      number: "03",
      icon: "CreditCard",
      title: "Secure Payment",
      description: "Complete your purchase using our secure payment gateway. Multiple payment options available for your convenience.",
      color: "from-green-500 to-green-600"
    },
    {
      number: "04",
      icon: "Zap",
      title: "Instant Access",
      description: "Receive your subscription credentials immediately. Start streaming your favorite content within minutes of purchase.",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <section className="bg-gradient-to-br from-[#F2F4F4] to-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <Icon name="Lightbulb" size={18} color="var(--color-primary)" />
            <span className="text-sm font-medium text-primary">Simple Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started with premium OTT subscriptions in just four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps?.map((step, index) => (
            <div key={index} className="relative">
              {index < steps?.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-border to-transparent -translate-x-1/2 z-0" />
              )}
              
              <div className="relative bg-white rounded-2xl border border-border p-6 hover:shadow-prominent transition-standard group">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-14 h-14 bg-gradient-to-br ${step?.color} rounded-xl flex items-center justify-center shadow-moderate group-hover:scale-110 transition-standard`}>
                      <Icon name={step?.icon} size={24} color="white" />
                    </div>
                    <span className="text-4xl font-bold text-muted opacity-20">{step?.number}</span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{step?.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step?.description}</p>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center gap-2 text-primary text-sm font-medium">
                      <span>Learn more</span>
                      <Icon name="ArrowRight" size={16} color="var(--color-primary)" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl border border-border p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full">
                <Icon name="CheckCircle2" size={18} color="var(--color-success)" />
                <span className="text-sm font-medium text-success">Why Choose Us</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                The Smart Way to Stream
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We've revolutionized OTT subscription access by offering legitimate, verified subscriptions at prices that make sense. No hidden fees, no surprises—just straightforward savings.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Users" size={24} color="var(--color-primary)" />
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">50K+</p>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </div>
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Star" size={24} color="var(--color-primary)" />
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">4.9/5</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Zap" size={24} color="var(--color-primary)" />
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">&lt;5min</p>
                <p className="text-sm text-muted-foreground">Delivery Time</p>
              </div>
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Shield" size={24} color="var(--color-primary)" />
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">100%</p>
                <p className="text-sm text-muted-foreground">Secure Payments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;