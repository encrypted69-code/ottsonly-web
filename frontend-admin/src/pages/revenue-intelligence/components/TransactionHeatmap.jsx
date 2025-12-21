import Icon from '../../../components/AppIcon';

const TransactionHeatmap = ({ data }) => {
  const getIntensityColor = (value) => {
    if (value >= 80) return 'bg-primary';
    if (value >= 60) return 'bg-secondary';
    if (value >= 40) return 'bg-accent';
    if (value >= 20) return 'bg-warning/50';
    return 'bg-muted';
  };

  const getIntensityOpacity = (value) => {
    return `opacity-${Math.min(100, Math.max(20, value))}`;
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Transaction Volume Heatmap</h3>
          <p className="text-sm text-muted-foreground mt-1">Peak usage patterns across time zones</p>
        </div>
        <Icon name="Activity" size={20} color="var(--color-primary)" />
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div className="grid grid-cols-25 gap-1 mb-2">
            <div className="text-xs text-muted-foreground font-medium"></div>
            {Array.from({ length: 24 }, (_, i) => (
              <div key={i} className="text-xs text-center text-muted-foreground font-medium">
                {i?.toString()?.padStart(2, '0')}
              </div>
            ))}
          </div>
          {data?.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-25 gap-1 mb-1">
              <div className="text-xs text-muted-foreground font-medium flex items-center">
                {row?.day}
              </div>
              {row?.hours?.map((value, colIndex) => (
                <div
                  key={colIndex}
                  className={`h-8 rounded ${getIntensityColor(value)} ${getIntensityOpacity(value)} hover:ring-2 hover:ring-primary transition-smooth cursor-pointer`}
                  title={`${row?.day} ${colIndex}:00 - ${value}% activity`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <span className="text-xs text-muted-foreground">Activity Level:</span>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">Low</span>
          <div className="flex space-x-1">
            <div className="w-6 h-4 rounded bg-muted"></div>
            <div className="w-6 h-4 rounded bg-warning/50"></div>
            <div className="w-6 h-4 rounded bg-accent"></div>
            <div className="w-6 h-4 rounded bg-secondary"></div>
            <div className="w-6 h-4 rounded bg-primary"></div>
          </div>
          <span className="text-xs text-muted-foreground">High</span>
        </div>
      </div>
    </div>
  );
};

export default TransactionHeatmap;