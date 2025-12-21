import React from 'react';
import Icon from '../../../components/AppIcon';

const ConnectionStatus = ({ isConnected, lastUpdate, autoRefreshInterval }) => {
  return (
    <div className="flex items-center space-x-4 text-sm">
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-error'}`} />
        <span className="text-muted-foreground">
          {isConnected ? 'Live Connection' : 'Disconnected'}
        </span>
      </div>
      <div className="flex items-center space-x-2 text-muted-foreground">
        <Icon name="RefreshCw" size={14} />
        <span>Every {autoRefreshInterval}s</span>
      </div>
      {lastUpdate && (
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Icon name="Clock" size={14} />
          <span>Updated {lastUpdate}</span>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;