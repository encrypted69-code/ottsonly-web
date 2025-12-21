// Code will be added manually
import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustBadges = () => {
  const badges = [
    {
      icon: 'Shield',
      label: 'Secure Registration',
      description: 'Your data is encrypted'
    },
    {
      icon: 'Lock',
      label: 'Privacy Protected',
      description: 'We never share your info'
    },
    {
      icon: 'CheckCircle2',
      label: 'Instant Access',
      description: 'Start using immediately'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
      {badges?.map((badge, index) => (
        <div
          key={index}
          className="flex items-start gap-3 p-4 bg-card rounded-lg border border-border"
        >
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name={badge?.icon} size={20} color="var(--color-primary)" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground mb-1">
              {badge?.label}
            </h4>
            <p className="text-xs text-muted-foreground">
              {badge?.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;