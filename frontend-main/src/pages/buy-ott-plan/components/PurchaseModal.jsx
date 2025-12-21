// Code will be added manually
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const PurchaseModal = ({ plan, walletBalance, onClose, onConfirmPurchase, isProcessing }) => {
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const hasInsufficientBalance = walletBalance < plan?.discountedPrice;

  const handlePurchase = () => {
    if (!agreeTerms) return;
    if (hasInsufficientBalance && paymentMethod === 'wallet') return;
    onConfirmPurchase(plan, paymentMethod);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-foreground/40 z-[250] animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
        <div className="bg-background rounded-lg border border-border shadow-prominent max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in">
          <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Confirm Purchase</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-micro"
              disabled={isProcessing}
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-card rounded-lg border border-border p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                  <Image 
                    src={plan?.logo} 
                    alt={plan?.logoAlt}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{plan?.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan?.platform}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="font-medium text-foreground">{plan?.duration} {plan?.duration === 1 ? 'Month' : 'Months'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Original Price</span>
                <span className="text-sm text-muted-foreground line-through">₹{plan?.originalPrice?.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Discounted Price</span>
                <span className="text-lg font-bold text-primary">₹{plan?.discountedPrice?.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Payment Method</label>
              
              <button
                onClick={() => setPaymentMethod('wallet')}
                className={`
                  w-full flex items-center justify-between p-4 rounded-lg border transition-standard
                  ${paymentMethod === 'wallet'
                    ? 'border-primary bg-primary/5' :'border-border bg-card hover:border-primary/50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    ${paymentMethod === 'wallet' ? 'bg-primary/10' : 'bg-muted'}
                  `}>
                    <Icon 
                      name="Wallet" 
                      size={20} 
                      color={paymentMethod === 'wallet' ? 'var(--color-primary)' : 'var(--color-muted-foreground)'}
                    />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-foreground">Wallet Balance</div>
                    <div className="text-sm text-muted-foreground">₹{walletBalance?.toFixed(2)} available</div>
                  </div>
                </div>
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${paymentMethod === 'wallet' ? 'border-primary' : 'border-border'}
                `}>
                  {paymentMethod === 'wallet' && (
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  )}
                </div>
              </button>

              {hasInsufficientBalance && paymentMethod === 'wallet' && (
                <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <Icon name="AlertTriangle" size={16} color="var(--color-warning)" className="mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-warning">
                    Insufficient wallet balance. Please add money to your wallet or choose another payment method.
                  </div>
                </div>
              )}

              <button
                onClick={() => setPaymentMethod('card')}
                className={`
                  w-full flex items-center justify-between p-4 rounded-lg border transition-standard
                  ${paymentMethod === 'card' ?'border-primary bg-primary/5' :'border-border bg-card hover:border-primary/50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    ${paymentMethod === 'card' ? 'bg-primary/10' : 'bg-muted'}
                  `}>
                    <Icon 
                      name="CreditCard" 
                      size={20} 
                      color={paymentMethod === 'card' ? 'var(--color-primary)' : 'var(--color-muted-foreground)'}
                    />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-foreground">Credit/Debit Card</div>
                    <div className="text-sm text-muted-foreground">Pay securely with card</div>
                  </div>
                </div>
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${paymentMethod === 'card' ? 'border-primary' : 'border-border'}
                `}>
                  {paymentMethod === 'card' && (
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  )}
                </div>
              </button>
            </div>

            <Checkbox
              label="I agree to the terms and conditions"
              description="By purchasing, you agree to our refund and subscription policies"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e?.target?.checked)}
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                fullWidth
                onClick={onClose}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                fullWidth
                iconName="Lock"
                iconPosition="left"
                onClick={handlePurchase}
                disabled={!agreeTerms || (hasInsufficientBalance && paymentMethod === 'wallet') || isProcessing}
                loading={isProcessing}
              >
                Confirm Purchase
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PurchaseModal;