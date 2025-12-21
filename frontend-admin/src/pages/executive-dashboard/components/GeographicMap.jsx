import Icon from '../../../components/AppIcon';

const GeographicMap = ({ regions }) => {
  const maxRevenue = Math.max(...regions?.map(r => r?.revenue));

  return (
    <div className="bg-card rounded-lg p-6 shadow-card border border-border h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Geographic Distribution</h3>
          <p className="text-sm text-muted-foreground mt-1">Revenue by region</p>
        </div>
        <Icon name="Globe" size={20} color="var(--color-primary)" />
      </div>
      <div className="space-y-4">
        {regions?.map((region, index) => {
          const percentage = (region?.revenue / maxRevenue) * 100;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground">{region?.name}</span>
                  <span className="text-xs text-muted-foreground">({region?.users?.toLocaleString()} users)</span>
                </div>
                <span className="text-sm font-semibold text-primary">${region?.revenue?.toLocaleString()}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Global Revenue</span>
          <span className="text-lg font-bold text-foreground">
            ${regions?.reduce((sum, r) => sum + r?.revenue, 0)?.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GeographicMap;