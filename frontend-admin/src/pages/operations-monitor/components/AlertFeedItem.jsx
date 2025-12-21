import Icon from '../../../components/AppIcon';

const AlertFeedItem = ({ alert, onAction }) => {
  const getSeverityConfig = () => {
    switch (alert?.severity) {
      case 'critical':
        return {
          bgColor: 'bg-error/10',
          borderColor: 'border-error',
          textColor: 'text-error',
          icon: 'AlertCircle'
        };
      case 'warning':
        return {
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning',
          textColor: 'text-warning',
          icon: 'AlertTriangle'
        };
      case 'info':
        return {
          bgColor: 'bg-accent/10',
          borderColor: 'border-accent',
          textColor: 'text-accent',
          icon: 'Info'
        };
      default:
        return {
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          textColor: 'text-muted-foreground',
          icon: 'Bell'
        };
    }
  };

  const config = getSeverityConfig();
  const timeAgo = new Date(alert.timestamp)?.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={`${config?.bgColor} border-l-4 ${config?.borderColor} rounded-lg p-3 mb-3 transition-smooth hover:shadow-card`}>
      <div className="flex items-start space-x-3">
        <div className={`${config?.textColor} mt-0.5`}>
          <Icon name={config?.icon} size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h4 className="text-sm font-semibold text-card-foreground">{alert?.title}</h4>
            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{timeAgo}</span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{alert?.message}</p>
          <div className="flex items-center space-x-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${config?.bgColor} ${config?.textColor}`}>
              {alert?.source}
            </span>
            {alert?.actionable && (
              <button
                onClick={() => onAction(alert?.id)}
                className="text-xs font-medium text-primary hover:text-primary/80 transition-smooth"
              >
                Investigate →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertFeedItem;