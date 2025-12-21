// Code will be added manually
import React from 'react';
import Icon from '../../../components/AppIcon';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date()?.getFullYear();

  const footerLinks = {
    company: [
      { label: "About Us", path: "/about" },
      { label: "How It Works", path: "/how-it-works" },
      { label: "Contact", path: "/contact" },
      { label: "Careers", path: "/careers" }
    ],
    support: [
      { label: "Help Center", path: "/support" },
      { label: "FAQ", path: "/faq" },
      { label: "Terms of Service", path: "/terms" },
      { label: "Privacy Policy", path: "/privacy" }
    ],
    platforms: [
      { label: "Netflix", path: "/buy-ott-plan" },
      { label: "Prime Video", path: "/buy-ott-plan" },
      { label: "Disney+ Hotstar", path: "/buy-ott-plan" },
      { label: "Spotify", path: "/buy-ott-plan" }
    ]
  };

  const socialLinks = [
    { icon: "Facebook", url: "https://facebook.com", label: "Facebook" },
    { icon: "Twitter", url: "https://twitter.com", label: "Twitter" },
    { icon: "Instagram", url: "https://instagram.com", label: "Instagram" },
    { icon: "Linkedin", url: "https://linkedin.com", label: "LinkedIn" }
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Tv" size={24} color="white" />
              </div>
              <span className="text-2xl font-bold">OTTSONLY</span>
            </div>
            <p className="text-secondary-foreground/80 leading-relaxed max-w-sm">
              Your trusted platform for premium OTT subscriptions at unbeatable prices. Save up to 90% on your favorite streaming services.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks?.map((social, index) => (
                <a
                  key={index}
                  href={social?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-secondary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary transition-standard"
                  aria-label={social?.label}
                >
                  <Icon name={social?.icon} size={18} color="white" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks?.company?.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link?.path)}
                    className="text-secondary-foreground/80 hover:text-primary transition-micro text-sm"
                  >
                    {link?.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks?.support?.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link?.path)}
                    className="text-secondary-foreground/80 hover:text-primary transition-micro text-sm"
                  >
                    {link?.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Platforms</h3>
            <ul className="space-y-3">
              {footerLinks?.platforms?.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link?.path)}
                    className="text-secondary-foreground/80 hover:text-primary transition-micro text-sm"
                  >
                    {link?.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-secondary-foreground/80">
              © {currentYear} OTTSONLY. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Icon name="Shield" size={16} color="var(--color-primary)" />
                <span className="text-sm text-secondary-foreground/80">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Award" size={16} color="var(--color-primary)" />
                <span className="text-sm text-secondary-foreground/80">Verified Platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;