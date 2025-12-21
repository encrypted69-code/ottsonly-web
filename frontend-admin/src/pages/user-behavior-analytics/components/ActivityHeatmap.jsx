import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityHeatmap = ({ heatmapData }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['12am', '4am', '8am', '12pm', '4pm', '8pm'];

  const getIntensityColor = (value) => {
    if (value >= 80) return 'bg-primary';
    if (value >= 60) return 'bg-primary/70';
    if (value >= 40) return 'bg-primary/50';
    if (value >= 20) return 'bg-primary/30';
    return 'bg-primary/10';
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-card h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Activity Heatmap</h3>
        <Icon name="Clock" size={20} color="var(--color-primary)" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-xs text-muted-foreground w-12"></span>
          {hours?.map((hour) => (
            <div key={hour} className="flex-1 text-center">
              <span className="text-xs text-muted-foreground">{hour}</span>
            </div>
          ))}
        </div>

        {days?.map((day, dayIndex) => (
          <div key={day} className="flex items-center space-x-2">
            <span className="text-xs font-medium text-muted-foreground w-12">{day}</span>
            {heatmapData?.[dayIndex]?.map((value, hourIndex) => (
              <div
                key={`${dayIndex}-${hourIndex}`}
                className={`flex-1 h-8 rounded ${getIntensityColor(value)} transition-smooth hover:scale-110 cursor-pointer`}
                title={`${day} ${hours?.[hourIndex]}: ${value}% activity`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <span className="text-xs text-muted-foreground">Less</span>
        <div className="flex items-center space-x-1">
          {[10, 30, 50, 70, 90]?.map((value) => (
            <div
              key={value}
              className={`w-4 h-4 rounded ${getIntensityColor(value)}`}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">More</span>
      </div>
    </div>
  );
};

export default ActivityHeatmap;