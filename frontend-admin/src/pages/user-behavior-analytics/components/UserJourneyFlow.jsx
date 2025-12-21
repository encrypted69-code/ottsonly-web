import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const UserJourneyFlow = ({ journeyData }) => {
  const [selectedNode, setSelectedNode] = useState(null);

  const handleNodeClick = (node) => {
    setSelectedNode(selectedNode?.id === node?.id ? null : node);
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">User Journey Flow</h2>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-md hover:bg-primary/20 transition-smooth">
            Export Flow
          </button>
        </div>
      </div>
      <div className="relative overflow-x-auto">
        <div className="min-w-[800px] h-[400px] relative">
          {journeyData?.map((node, index) => (
            <div key={node?.id}>
              <div
                onClick={() => handleNodeClick(node)}
                className={`absolute cursor-pointer transition-smooth ${
                  selectedNode?.id === node?.id ? 'scale-110 z-10' : 'hover:scale-105'
                }`}
                style={{
                  left: `${node?.x}%`,
                  top: `${node?.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className={`w-32 h-32 rounded-xl flex flex-col items-center justify-center shadow-card ${
                  selectedNode?.id === node?.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background border-2 border-border hover:border-primary'
                }`}>
                  <Icon 
                    name={node?.icon} 
                    size={32} 
                    color={selectedNode?.id === node?.id ? 'var(--color-primary-foreground)' : 'var(--color-primary)'} 
                  />
                  <p className="text-xs font-semibold mt-2 text-center px-2">{node?.label}</p>
                  <p className="text-lg font-bold mt-1">{node?.users}</p>
                </div>
              </div>

              {node?.connections && node?.connections?.map((connection, connIndex) => {
                const targetNode = journeyData?.find(n => n?.id === connection?.to);
                if (!targetNode) return null;

                return (
                  <svg
                    key={`${node?.id}-${connection?.to}-${connIndex}`}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    style={{ zIndex: 0 }}
                  >
                    <defs>
                      <marker
                        id={`arrowhead-${node?.id}-${connection?.to}`}
                        markerWidth="10"
                        markerHeight="10"
                        refX="9"
                        refY="3"
                        orient="auto"
                      >
                        <polygon
                          points="0 0, 10 3, 0 6"
                          fill="var(--color-primary)"
                          opacity="0.4"
                        />
                      </marker>
                    </defs>
                    <line
                      x1={`${node?.x}%`}
                      y1={`${node?.y}%`}
                      x2={`${targetNode?.x}%`}
                      y2={`${targetNode?.y}%`}
                      stroke="var(--color-primary)"
                      strokeWidth={connection?.strength * 3}
                      opacity="0.3"
                      markerEnd={`url(#arrowhead-${node?.id}-${connection?.to})`}
                    />
                  </svg>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {selectedNode && (
        <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">{selectedNode?.label}</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Total Users</p>
                  <p className="text-lg font-bold text-foreground">{selectedNode?.users}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg. Time Spent</p>
                  <p className="text-lg font-bold text-foreground">{selectedNode?.avgTime}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Conversion Rate</p>
                  <p className="text-lg font-bold text-foreground">{selectedNode?.conversionRate}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Icon name="X" size={20} color="currentColor" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserJourneyFlow;