import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const EditOTTModal = ({ platform, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: platform?.name || '',
    logo: platform?.logo || '',
    status: platform?.status || 'active'
  });

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (formData?.name && formData?.logo) {
      onSave?.(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-md shadow-dropdown border border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Edit OTT Platform</h2>
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
              value={formData?.name}
              onChange={(e) => setFormData({ ...formData, name: e?.target?.value })}
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Logo URL
            </label>
            <Input
              type="url"
              placeholder="https://example.com/logo.png"
              value={formData?.logo}
              onChange={(e) => setFormData({ ...formData, logo: e?.target?.value })}
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Status
            </label>
            <select
              value={formData?.status}
              onChange={(e) => setFormData({ ...formData, status: e?.target?.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOTTModal;