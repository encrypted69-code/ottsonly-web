import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const EngagementLeaderboard = ({ users }) => {
  const getMedalIcon = (rank) => {
    if (rank === 1) return { name: 'Award', color: 'var(--color-warning)' };
    if (rank === 2) return { name: 'Award', color: '#94A3B8' };
    if (rank === 3) return { name: 'Award', color: '#CD7F32' };
    return { name: 'User', color: 'var(--color-muted-foreground)' };
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-card h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Top Engaged Users</h3>
        <Icon name="TrendingUp" size={20} color="var(--color-primary)" />
      </div>
      <div className="space-y-4">
        {users?.map((user, index) => {
          const medal = getMedalIcon(index + 1);
          return (
            <div
              key={user?.id}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-smooth"
            >
              <div className="flex-shrink-0">
                <Icon name={medal?.name} size={20} color={medal?.color} />
              </div>
              <div className="flex-shrink-0">
                <Image
                  src={user?.avatar}
                  alt={user?.avatarAlt}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.segment}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary">{user?.score}</p>
                <p className="text-xs text-muted-foreground">score</p>
              </div>
            </div>
          );
        })}
      </div>
      <button className="w-full mt-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-smooth">
        View All Users
      </button>
    </div>
  );
};

export default EngagementLeaderboard;