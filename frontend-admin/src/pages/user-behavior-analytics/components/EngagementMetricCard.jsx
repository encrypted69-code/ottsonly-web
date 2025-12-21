import React from 'react';
import Icon from '../../../components/AppIcon';

const EngagementMetricCard = ({ title, value, change, changeType, icon, trend }) => {
  const isPositive = changeType === 'positive';
  const isNegative = changeType === 'negative';

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-card hover:shadow-dropdown transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name={icon} size={24} color="var(--color-primary)" strokeWidth={2} />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-3xl font-bold text-foreground">{value}</p>
        
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-md ${
            isPositive ? 'bg-success/10 text-success' : isNegative ?'bg-error/10 text-error': 'bg-muted text-muted-foreground'
          }`}>
            <Icon 
              name={isPositive ? 'TrendingUp' : isNegative ? 'TrendingDown' : 'Minus'} 
              size={14} 
              color="currentColor" 
            />
            <span className="text-xs font-semibold">{change}</span>
          </div>
          <span className="text-xs text-muted-foreground">vs last period</span>
        </div>

        {trend && trend?.length > 0 && (
          <div className="flex items-end space-x-1 h-8 mt-3">
            {trend?.map((value, index) => (
              <div
                key={index}
                className="flex-1 bg-primary/20 rounded-t transition-smooth hover:bg-primary/30"
                style={{ height: `${value}%` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EngagementMetricCard;