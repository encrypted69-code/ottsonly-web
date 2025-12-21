import React from 'react';
import Icon from '../../../components/AppIcon';

const ChurnPrediction = ({ predictions }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-error/10 text-error border-error/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'low':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return 'AlertTriangle';
      case 'medium':
        return 'AlertCircle';
      case 'low':
        return 'Info';
      default:
        return 'Info';
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-card h-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-1">Churn Prediction</h3>
        <p className="text-sm text-muted-foreground">At-risk customer alerts</p>
      </div>
      <div className="space-y-4">
        {predictions?.map((prediction) => (
          <div 
            key={prediction?.id}
            className={`p-4 rounded-lg border ${getSeverityColor(prediction?.severity)} transition-smooth hover:shadow-card`}
          >
            <div className="flex items-start space-x-3">
              <Icon 
                name={getSeverityIcon(prediction?.severity)} 
                size={20} 
                color="currentColor" 
                strokeWidth={2}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold">{prediction?.segment}</h4>
                  <span className="text-xs font-medium px-2 py-1 rounded-md bg-background/50">
                    {prediction?.riskScore}% Risk
                  </span>
                </div>
                <p className="text-xs opacity-90 mb-2">{prediction?.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-75">{prediction?.affectedUsers} users affected</span>
                  <span className="opacity-75">{prediction?.timeframe}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Model Accuracy</span>
          <span className="font-semibold text-foreground">87.3%</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-muted-foreground">Last Updated</span>
          <span className="font-medium text-foreground">2 hours ago</span>
        </div>
      </div>
    </div>
  );
};

export default ChurnPrediction;