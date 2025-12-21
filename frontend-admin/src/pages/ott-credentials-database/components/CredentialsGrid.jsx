import Icon from '../../../components/AppIcon';

const CredentialsGrid = ({ credentials, onEdit, onDelete, onTestConnection }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {credentials?.map((credential) => (
        <div 
          key={credential?.id}
          className="bg-card rounded-lg p-6 shadow-card border border-border hover:shadow-dropdown transition-smooth"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-1">{credential?.platform}</h3>
              <div className="flex items-center space-x-2">
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  credential?.connectionStatus === 'active' ?'bg-success/10 text-success' 
                    : credential?.connectionStatus === 'testing' ?'bg-warning/10 text-warning' :'bg-error/10 text-error'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    credential?.connectionStatus === 'active' ?'bg-success' 
                      : credential?.connectionStatus === 'testing' ?'bg-warning' :'bg-error'
                  }`} />
                  <span className="capitalize">{credential?.connectionStatus}</span>
                </div>
                {credential?.encryptionStatus === 'enabled' && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                    <Icon name="Lock" size={12} color="currentColor" />
                    <span>Encrypted</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm text-muted-foreground">Username</span>
              <span className="text-sm font-medium text-foreground">{credential?.username}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm text-muted-foreground">Password</span>
              <span className="text-sm font-medium text-foreground">{credential?.password}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm text-muted-foreground">API Key</span>
              <span className="text-sm font-medium text-foreground">{credential?.apiKey}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm text-muted-foreground">Access Level</span>
              <span className="text-sm font-medium text-primary capitalize">{credential?.accessLevel}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm text-muted-foreground">Last Updated</span>
              <span className="text-sm font-medium text-foreground">{credential?.lastUpdated}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onTestConnection?.(credential?.id)}
              className="px-3 py-2 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-smooth flex items-center justify-center space-x-1 text-sm font-medium"
            >
              <Icon name="Play" size={14} color="currentColor" />
              <span>Test</span>
            </button>
            <button
              onClick={() => onEdit?.(credential)}
              className="px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-smooth flex items-center justify-center space-x-1 text-sm font-medium"
            >
              <Icon name="Edit" size={14} color="currentColor" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onDelete?.(credential?.id)}
              className="px-3 py-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-smooth flex items-center justify-center space-x-1 text-sm font-medium"
            >
              <Icon name="Trash2" size={14} color="currentColor" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CredentialsGrid;