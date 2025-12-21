import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustIndicators = () => {
  const indicators = [
    {
      icon: 'Shield',
      text: 'Secure Login',
      description: 'Your data is encrypted and protected'
    },
    {
      icon: 'Lock',
      text: 'Privacy Protected',
      description: 'We never share your information'
    },
    {
      icon: 'CheckCircle2',
      text: 'Verified Platform',
      description: 'Trusted by thousands of users'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
      {indicators?.map((indicator, index) => (
        <div 
          key={index}
          className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border"
        >
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name={indicator?.icon} size={20} color="var(--color-primary)" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">{indicator?.text}</p>
            <p className="text-xs text-muted-foreground truncate">{indicator?.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrustIndicators;