import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const PlatformBreakdown = ({ platforms }) => {
  const COLORS = ['#16A34A', '#22C55E', '#4ADE80', '#86EFAC', '#BBF7D0'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-dropdown">
          <p className="text-sm font-semibold text-popover-foreground">{payload?.[0]?.name}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {payload?.[0]?.value?.toLocaleString()} subscriptions ({payload?.[0]?.payload?.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-card border border-border h-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Platform Distribution</h3>
        <p className="text-sm text-muted-foreground mt-1">Active subscriptions by platform</p>
      </div>
      <div className="w-full h-64" aria-label="Platform Distribution Pie Chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={platforms}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ percentage }) => `${percentage}%`}
            >
              {platforms?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 space-y-3">
        {platforms?.map((platform, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS?.[index % COLORS?.length] }}
              />
              <span className="text-sm text-foreground">{platform?.name}</span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              {platform?.value?.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformBreakdown;