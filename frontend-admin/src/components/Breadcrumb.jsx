import { Link, useLocation } from 'react-router-dom';
import Icon from './AppIcon';

const Breadcrumb = () => {
  const location = useLocation();

  const breadcrumbMap = {
    '/executive-dashboard': 'Dashboard',
    '/subscription-analytics': 'Subscriptions',
    '/revenue-intelligence': 'Revenue',
    '/user-behavior-analytics': 'Users',
    '/operations-monitor': 'Operations'
  };

  const currentPath = location?.pathname;
  const currentLabel = breadcrumbMap?.[currentPath] || 'Dashboard';

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Link
        to="/executive-dashboard"
        className="flex items-center hover:text-primary transition-smooth"
      >
        <Icon name="Home" size={16} color="currentColor" className="mr-1" />
        Home
      </Link>
      {currentPath !== '/executive-dashboard' && (
        <>
          <Icon name="ChevronRight" size={14} color="var(--color-muted-foreground)" />
          <span className="text-foreground font-medium">{currentLabel}</span>
        </>
      )}
    </nav>
  );
};

export default Breadcrumb;