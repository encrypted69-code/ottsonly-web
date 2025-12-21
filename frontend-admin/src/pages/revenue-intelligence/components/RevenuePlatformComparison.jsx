import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const RevenuePlatformComparison = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-dropdown">
          <p className="text-sm font-semibold text-popover-foreground mb-2">{payload?.[0]?.payload?.platform}</p>
          <p className="text-sm text-success">
            Revenue: ${payload?.[0]?.value?.toLocaleString()}
          </p>
          <p className="text-sm text-accent">
            Subscriptions: {payload?.[1]?.value?.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Avg per user: ${(payload?.[0]?.value / payload?.[1]?.value)?.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Revenue per Platform</h3>
          <p className="text-sm text-muted-foreground mt-1">Comparative performance analysis</p>
        </div>
        <Icon name="TrendingUp" size={20} color="var(--color-primary)" />
      </div>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="platform" 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              yAxisId="left"
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}K`}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
            />
            <Bar 
              yAxisId="left"
              dataKey="revenue" 
              fill="#22C55E" 
              radius={[8, 8, 0, 0]}
              name="Revenue ($)"
            />
            <Bar 
              yAxisId="right"
              dataKey="subscriptions" 
              fill="#0EA5E9" 
              radius={[8, 8, 0, 0]}
              name="Subscriptions"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenuePlatformComparison;