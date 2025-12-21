import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AccountActionsPanel = ({ user, onBlock, onUnblock }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const isBlocked = user?.status === 'blocked';

  const handleBlockToggle = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (isBlocked) {
      onUnblock?.();
    } else {
      onBlock?.();
    }
    setIsProcessing(false);
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-card border border-border">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
          <Icon name="Shield" size={20} color="var(--color-error)" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Account Actions</h3>
          <p className="text-sm text-muted-foreground">Manage account access</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon 
              name={isBlocked ? 'XCircle' : 'CheckCircle'} 
              size={16} 
              color={isBlocked ? 'var(--color-error)' : 'var(--color-success)'} 
            />
            <span className="text-sm font-medium text-foreground">
              Account Status: {isBlocked ? 'Blocked' : 'Active'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {isBlocked 
              ? 'This account is currently blocked from accessing services' :'This account has full access to all services'
            }
          </p>
        </div>

        <Button
          onClick={handleBlockToggle}
          disabled={isProcessing}
          variant={isBlocked ? 'default' : 'outline'}
          className={`w-full flex items-center justify-center space-x-2 ${
            !isBlocked ? 'border-error text-error hover:bg-error hover:text-white' : ''
          }`}
        >
          <Icon name={isBlocked ? 'Unlock' : 'Lock'} size={16} color="currentColor" />
          <span>{isBlocked ? 'Unblock Account' : 'Block Account'}</span>
        </Button>

        {!isBlocked && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-start space-x-2 p-3 bg-warning/10 rounded-lg">
              <Icon name="AlertTriangle" size={16} color="var(--color-warning)" className="mt-0.5" />
              <p className="text-xs text-warning">
                Blocking this account will immediately revoke access to all services
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountActionsPanel;