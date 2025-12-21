import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PlanPopularity = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-dropdown">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry?.color }}></div>
                <span className="text-muted-foreground">{entry?.name}</span>
              </div>
              <span className="font-medium text-popover-foreground">{entry?.value?.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-1">Subscription Plan Trends</h3>
        <p className="text-sm text-muted-foreground">Platform-specific subscription popularity over time</p>
      </div>

      <div className="w-full h-80" aria-label="Subscription Plan Popularity Chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorNetflix" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E50914" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#E50914" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorPrime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00A8E1" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#00A8E1" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorDisney" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#113CCF" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#113CCF" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorHotstar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0F1014" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#0F1014" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area type="monotone" dataKey="Netflix" stackId="1" stroke="#E50914" fill="url(#colorNetflix)" />
            <Area type="monotone" dataKey="Prime Video" stackId="1" stroke="#00A8E1" fill="url(#colorPrime)" />
            <Area type="monotone" dataKey="Disney+" stackId="1" stroke="#113CCF" fill="url(#colorDisney)" />
            <Area type="monotone" dataKey="Hotstar" stackId="1" stroke="#0F1014" fill="url(#colorHotstar)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PlanPopularity;