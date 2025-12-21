import Icon from '../../../components/AppIcon';

const MetricsStrip = ({ metrics }) => {
  const metricsData = [
    {
      label: "Daily Active Users",
      value: "18,542",
      change: "+6.2%",
      trend: "up",
      icon: "Activity",
      sparkline: [45, 52, 48, 65, 72, 68, 85, 92, 88, 95, 100, 98, 95, 100]
    },
    {
      label: "Average Revenue Per User",
      value: "₹34.12",
      change: "+3.8%",
      trend: "up",
      icon: "DollarSign",
      sparkline: [60, 65, 62, 70, 75, 72, 80, 85, 82, 88, 92, 90, 95, 100]
    },
    {
      label: "Customer Lifetime Value",
      value: "₹1,248",
      change: "+11.5%",
      trend: "up",
      icon: "TrendingUp",
      sparkline: [50, 55, 58, 62, 68, 72, 75, 80, 85, 88, 92, 95, 98, 100]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics?.map((metric, index) => (
        <div 
          key={index}
          className="bg-card rounded-lg p-6 shadow-card border border-border hover:shadow-dropdown transition-smooth"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Icon name={metric?.icon} size={20} color="var(--color-accent)" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{metric?.label}</p>
                <h4 className="text-2xl font-bold text-foreground">{metric?.value}</h4>
              </div>
            </div>
          </div>

          {metric?.sparkline && metric?.sparkline?.length > 0 && (
            <div className="flex items-end space-x-1 h-8">
              {metric?.sparkline?.map((value, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-accent/20 rounded-t transition-smooth hover:bg-accent/30"
                  style={{ height: `${value}%` }}
                />
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center space-x-2">
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-md ${
              metric?.trend === 'up' ? 'bg-success/10 text-success' : 
              metric?.trend === 'down'? 'bg-error/10 text-error' : 'bg-muted text-muted-foreground'
            }`}>
              <Icon 
                name={metric?.trend === 'up' ? 'ArrowUp' : metric?.trend === 'down' ? 'ArrowDown' : 'Minus'} 
                size={12} 
                color="currentColor" 
              />
              <span className="text-xs font-semibold">{metric?.change}</span>
            </div>
            <span className="text-xs text-muted-foreground">from last week</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsStrip;