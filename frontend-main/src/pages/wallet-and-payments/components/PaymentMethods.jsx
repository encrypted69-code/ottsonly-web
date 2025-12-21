// Code will be added manually
import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const PaymentMethodsCard = ({ paymentMethods, onAddMethod, onRemoveMethod }) => {
  const getCardIcon = (type) => {
    const icons = {
      visa: 'CreditCard',
      mastercard: 'CreditCard',
      amex: 'CreditCard',
      upi: 'Smartphone',
      netbanking: 'Building2'
    };
    return icons?.[type] || 'CreditCard';
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Saved Payment Methods</h3>
        <Button
          variant="outline"
          size="sm"
          iconName="Plus"
          iconPosition="left"
          onClick={onAddMethod}
        >
          Add Method
        </Button>
      </div>
      <div className="space-y-3">
        {paymentMethods?.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="CreditCard" size={24} color="var(--color-muted-foreground)" />
            </div>
            <p className="text-sm text-muted-foreground">No payment methods saved yet</p>
          </div>
        ) : (
          paymentMethods?.map((method) => (
            <div
              key={method?.id}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/50 transition-standard"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center border border-border">
                  <Icon name={getCardIcon(method?.type)} size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{method?.name}</p>
                  <p className="text-xs text-muted-foreground">{method?.details}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {method?.isDefault && (
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                    Default
                  </span>
                )}
                <button
                  onClick={() => onRemoveMethod(method?.id)}
                  className="p-2 hover:bg-error/10 rounded-lg transition-micro"
                >
                  <Icon name="Trash2" size={16} color="var(--color-error)" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PaymentMethodsCard;