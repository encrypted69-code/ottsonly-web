import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const UserSearchBar = ({ onSearch, searchQuery }) => {
  const [inputValue, setInputValue] = useState(searchQuery || '');

  const handleSearch = () => {
    onSearch?.(inputValue);
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-card border border-border mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search by username..."
            value={inputValue}
            onChange={(e) => setInputValue(e?.target?.value)}
            onKeyPress={handleKeyPress}
            className="w-full"
          />
        </div>
        <Button 
          onClick={handleSearch}
          className="flex items-center space-x-2 px-6"
        >
          <Icon name="Search" size={18} color="currentColor" />
          <span>Search</span>
        </Button>
      </div>
    </div>
  );
};

export default UserSearchBar;