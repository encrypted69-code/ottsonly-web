import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const BehavioralSegmentation = ({ segmentData }) => {
  const [selectedSegment, setSelectedSegment] = useState(null);

  const COLORS = ['#22C55E', '#16A34A', '#0EA5E9', '#F59E0B', '#EF4444'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-dropdown">
          <p className="text-sm font-semibold text-popover-foreground mb-2">{payload?.[0]?.payload?.name}</p>
          <p className="text-xs text-muted-foreground mb-1">Users: {payload?.[0]?.value?.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Avg. Revenue: ${payload?.[0]?.payload?.avgRevenue}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Behavioral Segmentation</h2>
          <p className="text-sm text-muted-foreground mt-1">User clusters based on subscription preferences and usage patterns</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-md hover:bg-primary/20 transition-smooth">
            <Icon name="Download" size={14} color="currentColor" className="inline mr-1" />
            Export
          </button>
        </div>
      </div>
      <div className="h-[400px]" aria-label="Behavioral Segmentation Bar Chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={segmentData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            onClick={(data) => {
              if (data && data?.activePayload) {
                setSelectedSegment(data?.activePayload?.[0]?.payload);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
            />
            <YAxis
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              label={{ value: 'Number of Users', angle: -90, position: 'insideLeft', fill: 'var(--color-muted-foreground)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar
              dataKey="users"
              name="Users"
              radius={[8, 8, 0, 0]}
              cursor="pointer"
            >
              {segmentData?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS?.[index % COLORS?.length]}
                  opacity={selectedSegment?.name === entry?.name ? 1 : 0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {selectedSegment && (
        <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">{selectedSegment?.name}</h3>
            <button
              onClick={() => setSelectedSegment(null)}
              className="text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Icon name="X" size={18} color="currentColor" />
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Users</p>
              <p className="text-lg font-bold text-foreground">{selectedSegment?.users?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Avg. Revenue</p>
              <p className="text-lg font-bold text-foreground">${selectedSegment?.avgRevenue}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Engagement Score</p>
              <p className="text-lg font-bold text-foreground">{selectedSegment?.engagementScore}/100</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Churn Risk</p>
              <p className={`text-lg font-bold ${
                selectedSegment?.churnRisk === 'Low' ? 'text-success' :
                selectedSegment?.churnRisk === 'Medium'? 'text-warning' : 'text-error'
              }`}>{selectedSegment?.churnRisk}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">Key Characteristics:</p>
            <div className="flex flex-wrap gap-2">
              {selectedSegment?.characteristics?.map((char, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md"
                >
                  {char}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BehavioralSegmentation;