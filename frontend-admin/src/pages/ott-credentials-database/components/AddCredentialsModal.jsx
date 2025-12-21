import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const AddCredentialsModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    platform: '',
    username: '',
    password: '',
    apiKey: '',
    accessLevel: 'standard'
  });

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (formData?.platform && formData?.username && formData?.password) {
      onAdd?.(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg p-6 w-full max-w-md shadow-dropdown border border-border max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Add New Credentials</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-smooth"
          >
            <Icon name="X" size={20} color="var(--color-foreground)" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Platform Name
            </label>
            <Input
              type="text"
              placeholder="e.g., Netflix"
              value={formData?.platform}
              onChange={(e) => setFormData({ ...formData, platform: e?.target?.value })}
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Username / Email
            </label>
            <Input
              type="text"
              placeholder="admin@platform.com"
              value={formData?.username}
              onChange={(e) => setFormData({ ...formData, username: e?.target?.value })}
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter password"
              value={formData?.password}
              onChange={(e) => setFormData({ ...formData, password: e?.target?.value })}
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              API Key (Optional)
            </label>
            <Input
              type="text"
              placeholder="Enter API key"
              value={formData?.apiKey}
              onChange={(e) => setFormData({ ...formData, apiKey: e?.target?.value })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Access Level
            </label>
            <select
              value={formData?.accessLevel}
              onChange={(e) => setFormData({ ...formData, accessLevel: e?.target?.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="admin">Admin</option>
              <option value="standard">Standard</option>
              <option value="readonly">Read Only</option>
            </select>
          </div>

          <div className="p-3 bg-primary/10 rounded-lg flex items-start space-x-2">
            <Icon name="Lock" size={16} color="var(--color-primary)" className="mt-0.5" />
            <p className="text-xs text-primary">
              All credentials are encrypted and stored securely with AES-256 encryption
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Credentials
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCredentialsModal;