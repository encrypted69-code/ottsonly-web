import Icon from '../../../components/AppIcon';

const TransactionHistory = ({ transactions }) => {
  return (
    <div className="bg-card rounded-lg p-6 shadow-card border border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Clock" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Transaction History</h3>
            <p className="text-sm text-muted-foreground">Recent account activity</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {transactions?.map((txn) => (
          <div 
            key={txn?.id} 
            className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                txn?.type === 'credit' ? 'bg-success/10' : 'bg-error/10'
              }`}>
                <Icon 
                  name={txn?.type === 'credit' ? 'ArrowDownLeft' : 'ArrowUpRight'} 
                  size={18} 
                  color={txn?.type === 'credit' ? 'var(--color-success)' : 'var(--color-error)'} 
                />
              </div>
              <div>
                <p className="text-foreground font-medium">{txn?.description}</p>
                <p className="text-sm text-muted-foreground">{txn?.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-lg font-bold ${
                txn?.type === 'credit' ? 'text-success' : 'text-error'
              }`}>
                {txn?.type === 'credit' ? '+' : '-'}₹{txn?.amount?.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground capitalize">{txn?.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;