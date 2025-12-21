// Code will be added manually
import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const EmptyState = ({ type }) => {
  const navigate = useNavigate();

  const getContent = () => {
    if (type === 'active') {
      return {
        icon: 'ShoppingBag',
        title: 'No Subscriptions Yet',
        description: "You haven't purchased any subscriptions yet. Browse our exclusive OTT deals and start saving today!",
        buttonText: 'Browse OTT Plans',
        buttonAction: () => navigate('/buy-ott-plan')
      };
    }
    
    if (type === 'expired') {
      return {
        icon: 'Clock',
        title: 'No Expired Subscriptions',
        description: "You don't have any expired subscriptions. All your active plans are up to date.",
        buttonText: 'View Active Plans',
        buttonAction: () => {}
      };
    }

    return {
      icon: 'Search',
      title: 'No Results Found',
      description: 'We couldn\'t find any subscriptions matching your search criteria. Try adjusting your filters.',
      buttonText: 'Clear Filters',
      buttonAction: () => {}
    };
  };

  const content = getContent();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Icon name={content?.icon} size={40} color="var(--color-primary)" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2 text-center">
        {content?.title}
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
        {content?.description}
      </p>
      <Button 
        variant="default" 
        iconName="ArrowRight" 
        iconPosition="right"
        onClick={content?.buttonAction}
      >
        {content?.buttonText}
      </Button>
    </div>
  );
};

export default EmptyState;