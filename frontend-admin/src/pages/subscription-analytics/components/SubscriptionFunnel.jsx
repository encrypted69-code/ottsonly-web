import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const SubscriptionFunnel = ({ data }) => {
  const COLORS = ['#22C55E', '#16A34A', '#15803D', '#166534', '#14532D'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-dropdown">
          <p className="text-sm font-medium text-popover-foreground mb-1">{payload?.[0]?.payload?.stage}</p>
          <p className="text-xs text-muted-foreground">Users: {payload?.[0]?.value?.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Conversion: {payload?.[0]?.payload?.conversion}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-1">Subscription Funnel</h3>
        <p className="text-sm text-muted-foreground">Acquisition to renewal journey analysis</p>
      </div>
      <div className="w-full h-80" aria-label="Subscription Funnel Chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis type="number" stroke="var(--color-muted-foreground)" />
            <YAxis dataKey="stage" type="category" stroke="var(--color-muted-foreground)" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="users" radius={[0, 8, 8, 0]}>
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SubscriptionFunnel;