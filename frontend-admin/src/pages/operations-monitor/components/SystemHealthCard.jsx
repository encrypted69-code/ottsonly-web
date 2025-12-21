import Icon from '../../../components/AppIcon';

const SystemHealthCard = ({ title, value, unit, status, icon, trend, trendValue }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'healthy':
        return 'text-success bg-success/10 border-success/20';
      case 'warning':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'critical':
        return 'text-error bg-error/10 border-error/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className={`bg-card border rounded-lg p-4 transition-smooth hover:shadow-card ${getStatusColor()}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-lg bg-background/50 flex items-center justify-center">
            <Icon name={icon} size={20} color="currentColor" />
          </div>
          <h3 className="text-sm font-medium text-card-foreground">{title}</h3>
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            <Icon name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} size={14} />
            <span className="text-xs font-medium">{trendValue}</span>
          </div>
        )}
      </div>
      <div className="flex items-baseline space-x-2">
        <span className="text-2xl font-bold text-card-foreground">{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
};

export default SystemHealthCard;