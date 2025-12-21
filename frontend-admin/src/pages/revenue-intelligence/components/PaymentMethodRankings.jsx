import Icon from '../../../components/AppIcon';

const PaymentMethodRankings = ({ methods }) => {
  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Payment Method Performance</h3>
        <Icon name="CreditCard" size={20} color="var(--color-primary)" />
      </div>
      <div className="space-y-4">
        {methods?.map((method, index) => (
          <div key={method?.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  index === 0 ? 'bg-primary/20' : 'bg-muted'
                }`}>
                  <Icon 
                    name={method?.icon} 
                    size={16} 
                    color={index === 0 ? 'var(--color-primary)' : 'var(--color-muted-foreground)'} 
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{method?.name}</p>
                  <p className="text-xs text-muted-foreground">{method?.transactions} transactions</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">${method?.revenue?.toLocaleString()}</p>
                <p className={`text-xs font-medium ${
                  method?.successRate >= 95 ? 'text-success' : 
                  method?.successRate >= 90 ? 'text-warning' : 'text-error'
                }`}>
                  {method?.successRate}% success
                </p>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  index === 0 ? 'bg-primary' : 'bg-secondary'
                }`}
                style={{ width: `${method?.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodRankings;