import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const PlanManagementPanel = ({ platforms, onAddPlan, onEditPlan, onRemovePlan }) => {
  const [selectedPlatformId, setSelectedPlatformId] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planFormData, setPlanFormData] = useState({
    name: '',
    price: '',
    duration: '',
    features: ''
  });

  const selectedPlatform = platforms?.find(p => p?.id === selectedPlatformId);

  const handleAddPlan = () => {
    if (selectedPlatformId && planFormData?.name && planFormData?.price) {
      const features = planFormData?.features?.split(',')?.map(f => f?.trim())?.filter(f => f);
      onAddPlan?.(selectedPlatformId, {
        ...planFormData,
        price: parseFloat(planFormData?.price),
        features
      });
      setPlanFormData({ name: '', price: '', duration: '', features: '' });
      setShowAddForm(false);
    }
  };

  const handleEditPlan = () => {
    if (editingPlan && planFormData?.name && planFormData?.price) {
      const features = planFormData?.features?.split(',')?.map(f => f?.trim())?.filter(f => f);
      onEditPlan?.(selectedPlatformId, editingPlan?.id, {
        ...planFormData,
        price: parseFloat(planFormData?.price),
        features
      });
      setPlanFormData({ name: '', price: '', duration: '', features: '' });
      setEditingPlan(null);
    }
  };

  const startEditPlan = (plan) => {
    setEditingPlan(plan);
    setPlanFormData({
      name: plan?.name,
      price: plan?.price?.toString(),
      duration: plan?.duration,
      features: plan?.features?.join(', ')
    });
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-card border border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Package" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Plan Management</h3>
            <p className="text-sm text-muted-foreground">Add, edit, or remove subscription plans</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Select Platform
        </label>
        <select
          value={selectedPlatformId}
          onChange={(e) => {
            setSelectedPlatformId(e?.target?.value);
            setShowAddForm(false);
            setEditingPlan(null);
          }}
          className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Choose a platform...</option>
          {platforms?.map(platform => (
            <option key={platform?.id} value={platform?.id}>{platform?.name}</option>
          ))}
        </select>
      </div>

      {selectedPlatform && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-semibold text-foreground">Existing Plans</h4>
            <Button
              onClick={() => {
                setShowAddForm(true);
                setEditingPlan(null);
                setPlanFormData({ name: '', price: '', duration: '', features: '' });
              }}
              className="flex items-center space-x-2"
            >
              <Icon name="Plus" size={16} color="currentColor" />
              <span>Add Plan</span>
            </Button>
          </div>

          <div className="space-y-3">
            {selectedPlatform?.plans?.map(plan => (
              <div key={plan?.id} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="text-foreground font-semibold mb-1">{plan?.name}</h5>
                    <p className="text-primary font-bold text-lg mb-2">₹{plan?.price}/{plan?.duration}</p>
                    <div className="flex flex-wrap gap-2">
                      {plan?.features?.map((feature, idx) => (
                        <span key={idx} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => startEditPlan(plan)}
                      className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-smooth"
                    >
                      <Icon name="Edit" size={16} color="currentColor" />
                    </button>
                    <button
                      onClick={() => onRemovePlan?.(selectedPlatformId, plan?.id)}
                      className="p-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-smooth"
                    >
                      <Icon name="Trash2" size={16} color="currentColor" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {(showAddForm || editingPlan) && (
            <div className="p-6 bg-background rounded-lg border-2 border-primary space-y-4">
              <h4 className="text-md font-semibold text-foreground mb-4">
                {editingPlan ? 'Edit Plan' : 'Add New Plan'}
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Plan Name</label>
                  <Input
                    type="text"
                    placeholder="e.g., Premium"
                    value={planFormData?.name}
                    onChange={(e) => setPlanFormData({ ...planFormData, name: e?.target?.value })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Price (INR)</label>
                  <Input
                    type="number"
                    placeholder="299"
                    value={planFormData?.price}
                    onChange={(e) => setPlanFormData({ ...planFormData, price: e?.target?.value })}
                    className="w-full"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Duration</label>
                <Input
                  type="text"
                  placeholder="e.g., 1 Month, 12 Months"
                  value={planFormData?.duration}
                  onChange={(e) => setPlanFormData({ ...planFormData, duration: e?.target?.value })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Features (comma-separated)
                </label>
                <Input
                  type="text"
                  placeholder="e.g., 4K, 4 Screens, Download"
                  value={planFormData?.features}
                  onChange={(e) => setPlanFormData({ ...planFormData, features: e?.target?.value })}
                  className="w-full"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingPlan(null);
                    setPlanFormData({ name: '', price: '', duration: '', features: '' });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingPlan ? handleEditPlan : handleAddPlan}
                  className="flex-1"
                >
                  {editingPlan ? 'Save Changes' : 'Add Plan'}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlanManagementPanel;