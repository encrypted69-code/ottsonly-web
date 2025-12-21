import Icon from '../../../components/AppIcon';

const OTTPlatformGrid = ({ platforms, onEdit, onRemove }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {platforms?.map((platform) => (
        <div 
          key={platform?.id}
          className="bg-card rounded-lg p-6 shadow-card border border-border hover:shadow-dropdown transition-smooth"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <img 
                src={platform?.logo} 
                alt={`${platform?.name} logo`}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h3 className="text-lg font-bold text-foreground">{platform?.name}</h3>
                <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  platform?.status === 'active' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    platform?.status === 'active' ? 'bg-success' : 'bg-error'
                  }`} />
                  <span className="capitalize">{platform?.status}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Total Plans</p>
              <p className="text-2xl font-bold text-foreground">{platform?.totalPlans}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Active Users</p>
              <p className="text-2xl font-bold text-primary">{platform?.totalUsers?.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => onEdit?.(platform)}
              className="flex-1 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-smooth flex items-center justify-center space-x-2"
            >
              <Icon name="Edit" size={16} color="currentColor" />
              <span className="text-sm font-medium">Edit</span>
            </button>
            <button
              onClick={() => onRemove?.(platform?.id)}
              className="flex-1 px-4 py-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-smooth flex items-center justify-center space-x-2"
            >
              <Icon name="Trash2" size={16} color="currentColor" />
              <span className="text-sm font-medium">Remove</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OTTPlatformGrid;