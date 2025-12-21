import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const CredentialsSearch = ({ searchQuery, onSearch }) => {
  return (
    <div className="bg-card rounded-lg p-4 shadow-card border border-border mb-6">
      <div className="flex items-center space-x-3">
        <Icon name="Search" size={20} color="var(--color-muted-foreground)" />
        <Input
          type="text"
          placeholder="Search by platform name or username..."
          value={searchQuery}
          onChange={(e) => onSearch?.(e?.target?.value)}
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default CredentialsSearch;