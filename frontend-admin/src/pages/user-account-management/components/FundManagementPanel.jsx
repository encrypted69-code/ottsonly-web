import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const FundManagementPanel = ({ user, onAddFunds, onDeductFunds }) => {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddFunds = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onAddFunds?.(amount);
    setAmount('');
    setIsProcessing(false);
  };

  const handleDeductFunds = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onDeductFunds?.(amount);
    setAmount('');
    setIsProcessing(false);
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-card border border-border">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Wallet" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Fund Management</h3>
          <p className="text-sm text-muted-foreground">Add or deduct wallet funds</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Amount (INR)
          </label>
          <Input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e?.target?.value)}
            className="w-full"
            min="0"
            step="0.01"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleAddFunds}
            disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
            className="w-full flex items-center justify-center space-x-2"
          >
            <Icon name="Plus" size={16} color="currentColor" />
            <span>Add Funds</span>
          </Button>
          <Button
            onClick={handleDeductFunds}
            disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
          >
            <Icon name="Minus" size={16} color="currentColor" />
            <span>Deduct</span>
          </Button>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Balance</span>
            <span className="text-lg font-bold text-primary">₹{user?.balance?.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundManagementPanel;