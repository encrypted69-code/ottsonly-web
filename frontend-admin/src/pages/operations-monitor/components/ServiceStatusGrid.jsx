import Icon from '../../../components/AppIcon';

const ServiceStatusGrid = ({ services }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return { icon: 'CheckCircle2', color: 'text-success' };
      case 'degraded':
        return { icon: 'AlertTriangle', color: 'text-warning' };
      case 'down':
        return { icon: 'XCircle', color: 'text-error' };
      default:
        return { icon: 'HelpCircle', color: 'text-muted-foreground' };
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-sm font-semibold text-card-foreground mb-4">Service Status</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {services?.map((service) => {
          const statusConfig = getStatusIcon(service?.status);
          return (
            <div
              key={service?.id}
              className="bg-background border border-border rounded-lg p-3 transition-smooth hover:shadow-card"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon name={service?.icon} size={16} color="var(--color-primary)" />
                  <span className="text-sm font-medium text-card-foreground">{service?.name}</span>
                </div>
                <Icon name={statusConfig?.icon} size={16} className={statusConfig?.color} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Response Time</span>
                <span className="font-semibold text-card-foreground">{service?.responseTime}ms</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-muted-foreground">Uptime</span>
                <span className="font-semibold text-card-foreground">{service?.uptime}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceStatusGrid;