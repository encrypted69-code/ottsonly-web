import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ title, value, change, changeType, icon, trend }) => {
  const isPositive = changeType === 'positive';
  const isNegative = changeType === 'negative';
  
  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-card hover:shadow-dropdown transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-semibold text-foreground">{value}</h3>
        </div>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name={icon} size={24} color="var(--color-primary)" strokeWidth={2} />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-md ${
          isPositive ? 'bg-success/10 text-success' : isNegative ?'bg-error/10 text-error': 'bg-muted text-muted-foreground'
        }`}>
          <Icon 
            name={isPositive ? 'TrendingUp' : isNegative ? 'TrendingDown' : 'Minus'} 
            size={14} 
            color="currentColor" 
          />
          <span className="text-xs font-medium">{change}</span>
        </div>
        <span className="text-xs text-muted-foreground">{trend}</span>
      </div>
    </div>
  );
};

export default MetricCard;