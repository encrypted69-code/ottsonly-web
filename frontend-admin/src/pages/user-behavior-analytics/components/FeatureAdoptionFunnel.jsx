import React from 'react';
import Icon from '../../../components/AppIcon';

const FeatureAdoptionFunnel = ({ funnelData }) => {
  const maxUsers = Math.max(...funnelData?.map(stage => stage?.users));

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Feature Adoption Funnel</h2>
          <p className="text-sm text-muted-foreground mt-1">User progression through key features</p>
        </div>
        <Icon name="Filter" size={20} color="var(--color-primary)" />
      </div>
      <div className="space-y-4">
        {funnelData?.map((stage, index) => {
          const widthPercentage = (stage?.users / maxUsers) * 100;
          const dropoffRate = index > 0 ? ((funnelData?.[index - 1]?.users - stage?.users) / funnelData?.[index - 1]?.users * 100)?.toFixed(1) : 0;

          return (
            <div key={stage?.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{stage?.name}</p>
                    <p className="text-xs text-muted-foreground">{stage?.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">{stage?.users?.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{stage?.percentage}%</p>
                </div>
              </div>
              <div className="relative h-12 bg-muted rounded-lg overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/70 flex items-center justify-between px-4 transition-all duration-500"
                  style={{ width: `${widthPercentage}%` }}
                >
                  <span className="text-xs font-medium text-primary-foreground">
                    {stage?.avgTime}
                  </span>
                  <Icon name="ChevronRight" size={16} color="var(--color-primary-foreground)" />
                </div>
              </div>
              {index > 0 && dropoffRate > 0 && (
                <div className="flex items-center space-x-2 mt-2 ml-11">
                  <Icon name="TrendingDown" size={14} color="var(--color-error)" />
                  <span className="text-xs text-error font-medium">{dropoffRate}% drop-off</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Overall Conversion</p>
            <p className="text-lg font-bold text-foreground">
              {((funnelData?.[funnelData?.length - 1]?.users / funnelData?.[0]?.users) * 100)?.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Avg. Time to Complete</p>
            <p className="text-lg font-bold text-foreground">4.2 days</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Completion Rate</p>
            <p className="text-lg font-bold text-success">68.5%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureAdoptionFunnel;