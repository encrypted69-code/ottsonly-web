import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const PlatformPreferenceMatrix = ({ platformData }) => {
  const PLATFORM_COLORS = {
    'Netflix': '#E50914',
    'Prime Video': '#00A8E1',
    'Disney+': '#113CCF',
    'HBO Max': '#B100E8',
    'Hulu': '#1CE783',
    'Apple TV+': '#000000'
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-dropdown">
          <p className="text-sm font-semibold text-popover-foreground mb-2">{data?.platform}</p>
          <p className="text-xs text-muted-foreground">Engagement: {data?.engagement}%</p>
          <p className="text-xs text-muted-foreground">Satisfaction: {data?.satisfaction}%</p>
          <p className="text-xs text-muted-foreground">Users: {data?.users?.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Platform Preference Matrix</h2>
          <p className="text-sm text-muted-foreground mt-1">Engagement vs. Satisfaction analysis</p>
        </div>
        <Icon name="Grid" size={20} color="var(--color-primary)" />
      </div>
      <div className="h-[400px]" aria-label="Platform Preference Scatter Chart">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              type="number"
              dataKey="engagement"
              name="Engagement"
              unit="%"
              domain={[0, 100]}
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              label={{ value: 'Engagement Rate (%)', position: 'insideBottom', offset: -10, fill: 'var(--color-muted-foreground)' }}
            />
            <YAxis
              type="number"
              dataKey="satisfaction"
              name="Satisfaction"
              unit="%"
              domain={[0, 100]}
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              label={{ value: 'Satisfaction Score (%)', angle: -90, position: 'insideLeft', fill: 'var(--color-muted-foreground)' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Platforms" data={platformData}>
              {platformData?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={PLATFORM_COLORS?.[entry?.platform] || 'var(--color-primary)'}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
        {platformData?.map((platform) => (
          <div
            key={platform?.platform}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-smooth"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: PLATFORM_COLORS?.[platform?.platform] || 'var(--color-primary)' }}
            />
            <span className="text-xs font-medium text-foreground">{platform?.platform}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformPreferenceMatrix;