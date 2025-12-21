import { X, Plus, Trash2 } from 'lucide-react';

export default function AddPlatformForm({ platform, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: platform?.name || '',
    category: platform?.category || 'Entertainment',
    logo: platform?.logo || '',
    status: platform?.status || 'active',
    plans: platform?.plans || [{ type: '', price: '', features: [''] }],
  });

  const handlePlanChange = (index, field, value) => {
    const newPlans = [...formData?.plans];
    newPlans[index][field] = value;
    setFormData({ ...formData, plans: newPlans });
  };

  const handleFeatureChange = (planIndex, featureIndex, value) => {
    const newPlans = [...formData?.plans];
    newPlans[planIndex].features[featureIndex] = value;
    setFormData({ ...formData, plans: newPlans });
  };

  const addPlan = () => {
    setFormData({
      ...formData,
      plans: [...formData?.plans, { type: '', price: '', features: [''] }],
    });
  };

  const removePlan = (index) => {
    const newPlans = formData?.plans?.filter((_, i) => i !== index);
    setFormData({ ...formData, plans: newPlans });
  };

  const addFeature = (planIndex) => {
    const newPlans = [...formData?.plans];
    newPlans?.[planIndex]?.features?.push('');
    setFormData({ ...formData, plans: newPlans });
  };

  const removeFeature = (planIndex, featureIndex) => {
    const newPlans = [...formData?.plans];
    newPlans[planIndex].features = newPlans?.[planIndex]?.features?.filter((_, i) => i !== featureIndex);
    setFormData({ ...formData, plans: newPlans });
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {platform ? 'Edit Platform' : 'Add New Platform'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform Name
            </label>
            <input
              type="text"
              value={formData?.name}
              onChange={(e) => setFormData({ ...formData, name: e?.target?.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData?.category}
              onChange={(e) => setFormData({ ...formData, category: e?.target?.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Entertainment">Entertainment</option>
              <option value="Music">Music</option>
              <option value="Sports">Sports</option>
              <option value="News">News</option>
              <option value="Education">Education</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo URL
            </label>
            <input
              type="url"
              value={formData?.logo}
              onChange={(e) => setFormData({ ...formData, logo: e?.target?.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData?.status}
              onChange={(e) => setFormData({ ...formData, status: e?.target?.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Plans Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Subscription Plans</h3>
            <button
              type="button"
              onClick={addPlan}
              className="flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Plan
            </button>
          </div>

          <div className="space-y-4">
            {formData?.plans?.map((plan, planIndex) => (
              <div key={planIndex} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Plan {planIndex + 1}</h4>
                  {formData?.plans?.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePlan(planIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan Type
                    </label>
                    <input
                      type="text"
                      value={plan?.type}
                      onChange={(e) => handlePlanChange(planIndex, 'type', e?.target?.value)}
                      placeholder="e.g., Basic, Premium"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      value={plan?.price}
                      onChange={(e) => handlePlanChange(planIndex, 'price', e?.target?.value)}
                      placeholder="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      min="0"
                    />
                  </div>
                </div>

                {/* Features */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Features
                    </label>
                    <button
                      type="button"
                      onClick={() => addFeature(planIndex)}
                      className="text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      + Add Feature
                    </button>
                  </div>
                  <div className="space-y-2">
                    {plan?.features?.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(planIndex, featureIndex, e?.target?.value)}
                          placeholder="Feature description"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {plan?.features?.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(planIndex, featureIndex)}
                            className="px-3 py-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {platform ? 'Update Platform' : 'Add Platform'}
          </button>
        </div>
      </form>
    </div>
  );
}