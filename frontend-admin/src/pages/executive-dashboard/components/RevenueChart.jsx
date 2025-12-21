import { Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';

const RevenueChart = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-dropdown">
          <p className="text-sm font-semibold text-popover-foreground mb-2">{payload?.[0]?.payload?.month}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4 text-xs">
              <span className="text-muted-foreground">{entry?.name}:</span>
              <span className="font-semibold" style={{ color: entry?.color }}>
                {entry?.name === 'Revenue' ? `$${entry?.value?.toLocaleString()}` : entry?.value?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-card border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Revenue & User Growth</h3>
          <p className="text-sm text-muted-foreground mt-1">Monthly performance trends</p>
        </div>
      </div>
      <div className="w-full h-80" aria-label="Revenue and User Growth Chart">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-muted-foreground)" 
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              yAxisId="left"
              stroke="var(--color-muted-foreground)" 
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}k`}
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
              name="Revenue"
              fill="var(--color-primary)" 
              radius={[8, 8, 0, 0]}
              opacity={0.8}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="users" 
              name="New Users"
              stroke="var(--color-accent)" 
              strokeWidth={3}
              dot={{ fill: 'var(--color-accent)', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;