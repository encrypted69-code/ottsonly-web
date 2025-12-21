import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const CohortRetention = ({ data }) => {
  const [hoveredCell, setHoveredCell] = useState(null);

  const getColorIntensity = (value) => {
    if (value >= 80) return 'bg-success text-success-foreground';
    if (value >= 60) return 'bg-success/70 text-success-foreground';
    if (value >= 40) return 'bg-warning/50 text-warning-foreground';
    if (value >= 20) return 'bg-warning/30 text-foreground';
    return 'bg-error/20 text-foreground';
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Cohort Retention Analysis</h3>
          <p className="text-sm text-muted-foreground">Month-over-month retention heatmap</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-smooth">
          <Icon name="Download" size={16} color="currentColor" />
          <span className="text-sm font-medium">Export</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-xs font-semibold text-muted-foreground p-3 border-b border-border">
                Cohort
              </th>
              {data?.[0]?.months?.map((month, index) => (
                <th key={index} className="text-center text-xs font-semibold text-muted-foreground p-3 border-b border-border">
                  Month {index}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((cohort, cohortIndex) => (
              <tr key={cohortIndex}>
                <td className="text-sm font-medium text-foreground p-3 border-b border-border whitespace-nowrap">
                  {cohort?.cohortName}
                </td>
                {cohort?.months?.map((value, monthIndex) => (
                  <td 
                    key={monthIndex}
                    className="p-3 border-b border-border relative"
                    onMouseEnter={() => setHoveredCell({ cohort: cohortIndex, month: monthIndex })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    <div className={`w-full h-12 flex items-center justify-center rounded-md ${getColorIntensity(value)} transition-smooth cursor-pointer hover:scale-105`}>
                      <span className="text-sm font-semibold">{value}%</span>
                    </div>
                    {hoveredCell?.cohort === cohortIndex && hoveredCell?.month === monthIndex && (
                      <div className="absolute z-10 top-full left-1/2 transform -translate-x-1/2 mt-2 bg-popover border border-border rounded-lg p-3 shadow-dropdown whitespace-nowrap">
                        <p className="text-xs font-medium text-popover-foreground mb-1">{cohort?.cohortName}</p>
                        <p className="text-xs text-muted-foreground">Month {monthIndex}: {value}% retained</p>
                        <p className="text-xs text-muted-foreground">{cohort?.users?.[monthIndex]} active users</p>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex items-center justify-center space-x-6 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-success"></div>
          <span className="text-muted-foreground">80-100%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-success/70"></div>
          <span className="text-muted-foreground">60-79%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-warning/50"></div>
          <span className="text-muted-foreground">40-59%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-warning/30"></div>
          <span className="text-muted-foreground">20-39%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-error/20"></div>
          <span className="text-muted-foreground">0-19%</span>
        </div>
      </div>
    </div>
  );
};

export default CohortRetention;