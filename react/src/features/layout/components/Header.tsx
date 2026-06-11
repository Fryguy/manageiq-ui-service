import { useState } from 'react';
import {
  Header as CarbonHeader,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  HeaderMenuButton,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
} from '@carbon/react';
import { UserAvatar, Notification, Switcher } from '@carbon/icons-react';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import './Header.css';

interface HeaderProps {
  onMenuClick?: () => void;
  isSideNavExpanded?: boolean;
}

const Header = ({ onMenuClick, isSideNavExpanded = false }: HeaderProps) => {
  const navigate = useNavigate();
  const [showLanguageSwitcher, setShowLanguageSwitcher] = useState(false);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <HeaderContainer
      render={() => (
        <CarbonHeader aria-label="ManageIQ Service UI">
          <SkipToContent />
          <HeaderMenuButton
            aria-label={isSideNavExpanded ? 'Close menu' : 'Open menu'}
            onClick={onMenuClick}
            isActive={isSideNavExpanded}
          />
          <HeaderName href="/" prefix="">
            ManageIQ Service UI
          </HeaderName>
          <HeaderNavigation aria-label="ManageIQ Service UI" />
          <HeaderGlobalBar>
            <HeaderGlobalAction
              aria-label="Notifications"
              tooltipAlignment="end"
              onClick={() => {
                // TODO: Implement notifications panel
                console.log('Notifications clicked');
              }}
            >
              <Notification size={20} />
            </HeaderGlobalAction>
            <HeaderGlobalAction
              aria-label="Language"
              tooltipAlignment="end"
              onClick={() => setShowLanguageSwitcher(!showLanguageSwitcher)}
            >
              <Switcher size={20} />
            </HeaderGlobalAction>
            <HeaderGlobalAction
              aria-label="User Profile"
              tooltipAlignment="end"
              onClick={handleProfileClick}
            >
              <UserAvatar size={20} />
            </HeaderGlobalAction>
          </HeaderGlobalBar>
          {showLanguageSwitcher && (
            <div
              style={{
                position: 'absolute',
                top: '48px',
                right: '48px',
                zIndex: 9999,
              }}
            >
              <LanguageSwitcher onClose={() => setShowLanguageSwitcher(false)} />
            </div>
          )}
        </CarbonHeader>
      )}
    />
  );
};

export default Header;
