// Code will be added manually
import React from 'react';
import Icon from '../../../components/AppIcon';

const TransactionTable = ({ transactions, loading }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      success: {
        bg: 'bg-success/10',
        text: 'text-success',
        icon: 'CheckCircle2',
        label: 'Success'
      },
      pending: {
        bg: 'bg-warning/10',
        text: 'text-warning',
        icon: 'Clock',
        label: 'Pending'
      },
      failed: {
        bg: 'bg-error/10',
        text: 'text-error',
        icon: 'XCircle',
        label: 'Failed'
      }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config?.bg} ${config?.text}`}>
        <Icon name={config?.icon} size={14} />
        {config?.label}
      </span>
    );
  };

  const getTypeIcon = (type) => {
    return type === 'credit' ? (
      <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
        <Icon name="ArrowDownLeft" size={16} color="var(--color-success)" />
      </div>
    ) : (
      <div className="w-8 h-8 bg-error/10 rounded-lg flex items-center justify-center">
        <Icon name="ArrowUpRight" size={16} color="var(--color-error)" />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-8 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (transactions?.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-12 flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <Icon name="Wallet" size={32} color="var(--color-muted-foreground)" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-foreground">No Transaction History</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Add funds to see your transaction history and purchase OTTs
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hidden lg:block bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-foreground uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-foreground uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions?.map((transaction) => (
                <tr key={transaction?.id} className="hover:bg-muted/30 transition-micro">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(transaction?.type)}
                      <div>
                        <p className="text-sm font-medium text-foreground">{transaction?.description}</p>
                        <p className="text-xs text-muted-foreground">ID: {transaction?.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-foreground">
                      {new Date(transaction.date)?.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(transaction.date)?.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${transaction?.type === 'credit' ? 'text-success' : 'text-error'}`}>
                      {transaction?.type === 'credit' ? 'Credit' : 'Debit'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-sm font-semibold font-mono ${transaction?.type === 'credit' ? 'text-success' : 'text-error'}`}>
                      {transaction?.type === 'credit' ? '+' : '-'}₹{Math.abs(transaction?.amount)?.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(transaction?.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="lg:hidden space-y-3">
        {transactions?.map((transaction) => (
          <div key={transaction?.id} className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {getTypeIcon(transaction?.type)}
                <div>
                  <p className="text-sm font-medium text-foreground">{transaction?.description}</p>
                  <p className="text-xs text-muted-foreground">ID: {transaction?.id}</p>
                </div>
              </div>
              {getStatusBadge(transaction?.status)}
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="text-xs text-muted-foreground">
                {new Date(transaction.date)?.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <span className={`text-base font-semibold font-mono ${transaction?.type === 'credit' ? 'text-success' : 'text-error'}`}>
                {transaction?.type === 'credit' ? '+' : '-'}₹{Math.abs(transaction?.amount)?.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TransactionTable;