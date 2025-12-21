import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FraudAlerts = ({ alerts }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-error/10 border-error text-error';
      case 'high':
        return 'bg-warning/10 border-warning text-warning';
      case 'medium':
        return 'bg-accent/10 border-accent text-accent';
      default:
        return 'bg-muted border-border text-muted-foreground';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return 'AlertTriangle';
      case 'high':
        return 'AlertCircle';
      case 'medium':
        return 'Info';
      default:
        return 'Bell';
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Fraud Detection Alerts</h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">{alerts?.length} active</span>
          <Icon name="Shield" size={20} color="var(--color-primary)" />
        </div>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts?.map((alert) => (
          <div 
            key={alert?.id} 
            className={`p-4 rounded-lg border-2 ${getSeverityColor(alert?.severity)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start space-x-3">
                <Icon 
                  name={getSeverityIcon(alert?.severity)} 
                  size={20} 
                  color="currentColor" 
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{alert?.title}</p>
                  <p className="text-xs opacity-80 mt-1">{alert?.description}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-current opacity-30">
              <span className="text-xs font-medium">{alert?.timestamp}</span>
              <Button 
                variant="ghost" 
                size="xs"
                iconName="ExternalLink"
                iconPosition="right"
                iconSize={14}
              >
                Investigate
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FraudAlerts;