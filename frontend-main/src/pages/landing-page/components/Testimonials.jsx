// Code will be added manually
import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const Testimonials = () => {
  const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Content Creator",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1497cd398-1763294526444.png",
    avatarAlt: "Professional headshot of young woman with blonde hair and warm smile wearing casual blue top",
    rating: 5,
    comment: "I\'ve been using OTTSONLY for 6 months now and the savings are incredible! Got Netflix Premium for 70% off and the subscription works perfectly. Customer support is responsive and helpful.",
    platform: "Netflix Premium",
    verified: true
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_109a3496e-1763298522594.png",
    avatarAlt: "Professional headshot of Asian man with short black hair wearing navy blue business shirt",
    rating: 5,
    comment: "Best decision ever! I'm subscribed to Prime Video, Hotstar, and Spotify through OTTSONLY. The instant delivery is real—got my credentials within 2 minutes of payment. Highly recommended!",
    platform: "Multiple Subscriptions",
    verified: true
  },
  {
    name: "Priya Sharma",
    role: "Marketing Manager",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_10ca32616-1763295905430.png",
    avatarAlt: "Professional headshot of Indian woman with long dark hair wearing elegant red traditional attire",
    rating: 5,
    comment: "Initially skeptical about the pricing, but OTTSONLY proved to be 100% legitimate. The platform is user-friendly, payments are secure, and I'm saving over $500 annually on my subscriptions.",
    platform: "Disney+ Hotstar",
    verified: true
  },
  {
    name: "David Martinez",
    role: "Student",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_196006706-1763294305887.png",
    avatarAlt: "Professional headshot of Hispanic man with short brown hair and friendly smile wearing casual gray shirt",
    rating: 5,
    comment: "As a student on a budget, OTTSONLY is a lifesaver. I can afford multiple streaming services without breaking the bank. The wallet system makes it easy to manage payments too.",
    platform: "Spotify Premium",
    verified: true
  },
  {
    name: "Emily Thompson",
    role: "Freelance Designer",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1da86068d-1763299772431.png",
    avatarAlt: "Professional headshot of young woman with red hair and creative style wearing black turtleneck",
    rating: 5,
    comment: "The transparency and trust indicators on OTTSONLY made me confident in my purchase. Got SonyLiv and Zee5 subscriptions at amazing prices. Will definitely renew through them!",
    platform: "SonyLiv & Zee5",
    verified: true
  },
  {
    name: "James Wilson",
    role: "Business Analyst",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_18b455c05-1763292276996.png",
    avatarAlt: "Professional headshot of middle-aged man with gray hair wearing formal white shirt and tie",
    rating: 5,
    comment: "Excellent service from start to finish. The platform is professional, secure, and delivers exactly what it promises. I've recommended OTTSONLY to all my colleagues and friends.",
    platform: "Prime Video",
    verified: true
  }];


  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <Icon name="MessageSquare" size={18} color="var(--color-primary)" />
            <span className="text-sm font-medium text-primary">Customer Reviews</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust OTTSONLY for their streaming needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials?.map((testimonial, index) =>
          <div
            key={index}
            className="bg-card rounded-2xl border border-border p-6 hover:shadow-prominent transition-standard">

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                      <Image
                      src={testimonial?.avatar}
                      alt={testimonial?.avatarAlt}
                      className="w-full h-full object-cover" />

                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{testimonial?.name}</p>
                        {testimonial?.verified &&
                      <Icon name="BadgeCheck" size={16} color="var(--color-primary)" />
                      }
                      </div>
                      <p className="text-sm text-muted-foreground">{testimonial?.role}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(testimonial?.rating)]?.map((_, i) =>
                <Icon key={i} name="Star" size={16} color="var(--color-warning)" />
                )}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  "{testimonial?.comment}"
                </p>

                <div className="pt-2 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Icon name="PlaySquare" size={14} color="var(--color-primary)" />
                    <span className="text-xs font-medium text-primary">{testimonial?.platform}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 lg:p-12 border border-primary/20">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                Join Our Growing Community
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Become part of 50,000+ satisfied customers who are saving big on their favorite streaming services. Your entertainment journey starts here.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-6 text-center border border-border">
                <p className="text-3xl font-bold text-primary mb-1">4.9/5</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  {[...Array(5)]?.map((_, i) =>
                  <Icon key={i} name="Star" size={14} color="var(--color-warning)" />
                  )}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center border border-border">
                <p className="text-3xl font-bold text-primary mb-1">98%</p>
                <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Icon name="ThumbsUp" size={16} color="var(--color-success)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default Testimonials;