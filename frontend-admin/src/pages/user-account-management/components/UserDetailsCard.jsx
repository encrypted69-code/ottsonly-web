import Icon from '../../../components/AppIcon';

const UserDetailsCard = ({ user }) => {
  const statusColor = user?.status === 'active' ? 'text-success bg-success/10' : 'text-error bg-error/10';
  const statusIcon = user?.status === 'active' ? 'CheckCircle' : 'XCircle';

  return (
    <div className="bg-card rounded-lg p-6 shadow-card border border-border">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">{user?.fullName}</h2>
          <p className="text-muted-foreground">@{user?.username}</p>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${statusColor}`}>
          <Icon name={statusIcon} size={16} color="currentColor" />
          <span className="text-sm font-semibold capitalize">{user?.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">User ID</p>
            <p className="text-foreground font-medium">{user?.id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Email</p>
            <p className="text-foreground font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
            <p className="text-foreground font-medium">{user?.phoneNumber}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Wallet Balance</p>
            <p className="text-2xl font-bold text-primary">₹{user?.balance?.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Joined Date</p>
            <p className="text-foreground font-medium">{user?.joinedDate}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Last Active</p>
            <p className="text-foreground font-medium">{user?.lastActive}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-sm text-muted-foreground mb-3">Active Subscriptions</p>
        <div className="flex flex-wrap gap-2">
          {user?.subscriptions?.map((sub, index) => (
            <div key={index} className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {sub}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsCard;