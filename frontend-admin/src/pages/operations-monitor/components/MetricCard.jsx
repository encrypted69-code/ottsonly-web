import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ title, value, subtitle, icon, trend, trendValue, color = 'primary' }) => {
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    error: 'text-error bg-error/10',
    accent: 'text-accent bg-accent/10'
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 transition-smooth hover:shadow-card">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${colorClasses?.[color]} flex items-center justify-center`}>
          <Icon name={icon} size={20} color="currentColor" />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${trend === 'up' ? 'text-success' : 'text-error'}`}>
            <Icon name={trend === 'up' ? 'ArrowUp' : 'ArrowDown'} size={14} />
            <span className="text-xs font-medium">{trendValue}</span>
          </div>
        )}
      </div>
      <h3 className="text-xs text-muted-foreground mb-1">{title}</h3>
      <p className="text-2xl font-bold text-card-foreground mb-1">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
};

export default MetricCard;