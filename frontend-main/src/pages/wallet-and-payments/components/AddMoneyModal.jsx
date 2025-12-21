// Code will be added manually
import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { walletAPI } from '../../../services/api';

const AddMoneyModal = ({ isOpen, onClose, onAddMoney, quickAmounts }) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const paymentMethodOptions = [
    { value: 'razorpay', label: 'Razorpay (All Methods)' }
  ];

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!amount) return;

    const amountValue = parseFloat(amount);
    if (amountValue < 1) {
      alert('Minimum amount is ₹1');
      return;
    }

    setLoading(true);

    try {
      // Create Razorpay order
      const orderResponse = await walletAPI.addMoney(amountValue);
      
      const options = {
        key: orderResponse.razorpay_key,
        amount: orderResponse.amount * 100, // Convert to paise
        currency: orderResponse.currency,
        name: 'OTTSONLY',
        description: 'Add Money to Wallet',
        order_id: orderResponse.order_id,
        handler: async function (response) {
          try {
            // Verify payment
            await walletAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            // Success
            onAddMoney(amountValue);
            setAmount('');
            setPaymentMethod('razorpay');
            onClose();
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).name : '',
          email: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : '',
          contact: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).phone : ''
        },
        theme: {
          color: '#10b981'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Failed to initiate payment:', error);
      alert('Failed to initiate payment: ' + error.message);
      setLoading(false);
    }
  };

  const handleQuickAmount = (value) => {
    setAmount(value?.toString());
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-foreground/50 z-[200] animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
        <div className="bg-background rounded-2xl shadow-prominent max-w-md w-full animate-scale-in">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Wallet" size={20} color="var(--color-primary)" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Add Money to Wallet</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-micro"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <Input
                label="Enter Amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e?.target?.value)}
                required
                min="1"
                step="0.01"
              />
              <div className="grid grid-cols-4 gap-2 mt-3">
                {quickAmounts?.map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAmount(value)}
                  >
                    ₹{value}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Payment Method <span className="text-error">*</span>
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                required
              >
                <option value="razorpay">Razorpay - All payment methods supported</option>
              </select>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium text-foreground">₹{amount || '0.00'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Gateway Fee</span>
                <span className="font-medium text-foreground">₹0.00</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Total Amount</span>
                <span className="text-lg font-bold text-primary font-mono">₹{amount || '0.00'}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-info/5 rounded-lg border border-info/20">
              <Icon name="CreditCard" size={16} color="var(--color-info)" className="mt-0.5" />
              <div className="flex-1 text-xs text-foreground">
                <p className="font-semibold mb-1">Accepted Payment Methods:</p>
                <p className="text-muted-foreground">UPI • Credit/Debit Cards • Net Banking • Wallets</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <Icon name="Shield" size={16} color="var(--color-primary)" className="mt-0.5" />
              <p className="text-xs text-foreground">
                Secured by Razorpay with 256-bit SSL encryption. We never store your payment details.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                fullWidth
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                loading={loading}
                fullWidth
                disabled={!amount || amount < 1 || loading}
                iconName="Lock"
                iconPosition="left"
              >
                {loading ? 'Processing...' : 'Pay with Razorpay'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddMoneyModal;