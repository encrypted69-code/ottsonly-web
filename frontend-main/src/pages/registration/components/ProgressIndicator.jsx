// Code will be added manually
import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep }) => {
  const steps = [
    { id: 1, label: 'Details', icon: 'User' },
    { id: 2, label: 'Verification', icon: 'Shield' },
    { id: 3, label: 'Complete', icon: 'CheckCircle2' }
  ];

  return (
    <div className="flex items-center justify-between mb-8">
      {steps?.map((step, index) => (
        <React.Fragment key={step?.id}>
          <div className="flex flex-col items-center gap-2">
            <div
              className={`
                w-12 h-12 rounded-full flex items-center justify-center transition-standard
                ${currentStep >= step?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
                }
              `}
            >
              <Icon
                name={step?.icon}
                size={20}
                color={currentStep >= step?.id ? 'var(--color-primary-foreground)' : 'var(--color-muted-foreground)'}
              />
            </div>
            <span
              className={`
                text-xs font-medium
                ${currentStep >= step?.id ? 'text-foreground' : 'text-muted-foreground'}
              `}
            >
              {step?.label}
            </span>
          </div>
          {index < steps?.length - 1 && (
            <div className="flex-1 h-0.5 mx-2 mb-6">
              <div
                className={`
                  h-full transition-standard
                  ${currentStep > step?.id ? 'bg-primary' : 'bg-muted'}
                `}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressIndicator;