// Code will be added manually
import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const PlatformShowcase = () => {
  const platforms = [
  {
    name: "Netflix",
    logo: "https://i.ibb.co/ynC8tdH9/netflixlogo.png",
    logoAlt: "Netflix logo with red N letter on black background representing streaming service brand",
    originalPrice: "₹649",
    discountedPrice: "₹89",
    discount: "86%",
    color: "from-red-500 to-red-600"
  },
  {
    name: "Prime Video",
    logo: "https://i.ibb.co/gFJ2YxCr/primelogo.webp",
    logoAlt: "Amazon Prime Video logo with blue gradient and play button icon representing streaming platform",
    originalPrice: "₹299",
    discountedPrice: "₹35",
    discount: "88%",
    color: "from-blue-500 to-blue-600"
  },
  {
    name: "YouTube Premium",
    logo: "https://i.ibb.co/fdFBHghg/ytlogo.png",
    logoAlt: "YouTube Premium logo with red play button icon",
    originalPrice: "₹199",
    discountedPrice: "₹15",
    discount: "92%",
    color: "from-red-500 to-red-600"
  },
  {
    name: "Pornhub",
    logo: "https://i.ibb.co/Z6VTy4Bx/phublogo.png",
    logoAlt: "Pornhub logo",
    originalPrice: "₹1499",
    discountedPrice: "₹69",
    discount: "95%",
    color: "from-orange-500 to-orange-600"
  }];


  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <Icon name="Star" size={18} color="var(--color-primary)" />
            <span className="text-sm font-medium text-primary">Popular Platforms</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            All Your Favorite Streaming Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access premium content from the world's leading OTT platforms at unbeatable prices
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms?.map((platform, index) =>
          <div
            key={index}
            className="group bg-card rounded-2xl border border-border p-6 hover:shadow-prominent transition-standard cursor-pointer">

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shadow-subtle">
                    <Image
                    src={platform?.logo}
                    alt={platform?.logoAlt}
                    className="w-full h-full object-cover" />

                  </div>
                  <div className={`px-3 py-1 bg-gradient-to-r ${platform?.color} rounded-full`}>
                    <span className="text-white font-semibold text-sm">{platform?.discount} OFF</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">{platform?.name}</h3>
                  <p className="text-sm text-muted-foreground">Premium Subscription</p>
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Regular Price</span>
                    <span className="text-sm text-muted-foreground line-through">{platform?.originalPrice}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Your Price</span>
                    <span className="text-2xl font-bold text-primary">{platform?.discountedPrice}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-success">
                  <Icon name="CheckCircle2" size={16} color="var(--color-success)" />
                  <span>Instant Access Guaranteed</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Trusted by over 50,000+ satisfied customers</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <Icon name="Shield" size={20} color="var(--color-primary)" />
              <span className="text-sm font-medium text-foreground">100% Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Zap" size={20} color="var(--color-primary)" />
              <span className="text-sm font-medium text-foreground">Instant Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Award" size={20} color="var(--color-primary)" />
              <span className="text-sm font-medium text-foreground">Verified Subscriptions</span>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default PlatformShowcase;